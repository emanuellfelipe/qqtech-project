from fastapi import FastAPI, HTTPException, Depends
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import string
import secrets
from fastapi.middleware.cors import CORSMiddleware
import requests
from google.oauth2 import service_account
import json

# Configuração do banco de dados
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Definição do modelo SQLAlchemy
class User(Base):
    __tablename__ = 'usuario'

    id_usuario = Column(Integer, primary_key=True, index=True)
    matricula = Column(Integer, unique=True)
    nome_usuario = Column(String(255), unique=True)
    email = Column(String(255), unique=True)
    senha = Column(String(255))
    nome_completo = Column(String(255))

# Configuração do aplicativo FastAPI
app = FastAPI()

# Configuração CORS para permitir requisições do frontend em localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Carregar informações da conta de serviço do arquivo JSON
with open("C:/Users/980235/qqtech-project/public/seraphic-scarab-427700-h7-3e374fbcc6d3.json") as f:
    service_account_info = json.load(f)

# Configuração do envio de email com OAuth2
class GmailOAuth2:
    OAUTH2_CLIENT_ID = "249926372512-g30bnrg2d257ba8glp419horjul6iba6.apps.googleusercontent.com"
    OAUTH2_CLIENT_SECRET = "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"
    OAUTH2_REFRESH_TOKEN = "1//0hNwfEmkDlO9oCgYIARAAGBESNwF-L9Iru0MZVnGKITKmULy3TuDcxjH7L2wQeb3WQudJrlHcwHPDhw15-oE56kPvnOgBbjc4wMQ"

oauth2_config = GmailOAuth2()

# Função para obter o token OAuth2
def get_oauth2_token():
    try:
        credentials = service_account.Credentials.from_service_account_info(
            service_account_info,
            scopes=["https://www.googleapis.com/auth/gmail.send"]
        )
        access_token = credentials.refresh(requests.Request()).token
        return access_token
    except Exception as e:
        print(f"Erro ao obter token OAuth2: {e}")
        return None

# Função para enviar e-mail usando OAuth2
async def send_email_oauth2(message: MessageSchema):
    access_token = get_oauth2_token()

    if not access_token:
        raise HTTPException(status_code=500, detail="Erro ao obter token OAuth2")

    connection_config = ConnectionConfig(
        MAIL_USERNAME=oauth2_config.OAUTH2_CLIENT_ID,
        MAIL_PASSWORD=access_token,
        MAIL_PORT=587,
        MAIL_SERVER="smtp.gmail.com",
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        MAIL_FROM=oauth2_config.OAUTH2_CLIENT_ID,
    )

    fm = FastMail(connection_config)

    try:
        await fm.send_message(message)
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")
        raise HTTPException(status_code=500, detail="Erro ao enviar e-mail")

    return {"message": "Email enviado com sucesso"}

# Função para obter uma sessão de banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Modelos Pydantic
class EmailSchema(BaseModel):
    email: str

class Login(BaseModel):
    username: str
    password: str

# Funções auxiliares
def generate_reset_code(length=8):
    alphabet = string.ascii_letters + string.digits
    code = ''.join(secrets.choice(alphabet) for i in range(length))
    return code

# Endpoints
@app.post("/api/forgot-password")
async def forgot_password(payload: EmailSchema, db: Session = Depends(get_db)):
    try:
        email = payload.email
        if not email:
            raise HTTPException(status_code=400, detail="Email não fornecido")

        reset_code = generate_reset_code()

        message = MessageSchema(
            subject="Redefinição de senha",
            recipients=[email],
            body=f"Seu código de redefinição de senha é: {reset_code}",
            subtype="plain"
        )

        await send_email_oauth2(message)

        return {"message": "Email enviado com sucesso"}
    except Exception as e:
        print(f"Erro interno do servidor: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@app.options("/api/forgot-password")  # Manipulador OPTIONS para lidar com pré-verificação CORS
async def options_forgot_password():
    return {"Allow": "POST"}

@app.post('/api/login')
def login(login_data: Login, db: Session = Depends(get_db)):
    username = login_data.username
    password = login_data.password

    user = db.query(User).filter(User.nome_usuario == username).first()
    if not user or user.senha != password:
        raise HTTPException(status_code=401, detail='Credenciais inválidas')

    return {'message': 'Login bem-sucedido', 'user': {
        'id_usuario': user.id_usuario,
        'nome_usuario': user.nome_usuario,
        'email': user.email,
        'nome_completo': user.nome_completo
    }}

# Execução do aplicativo com uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=5000)
