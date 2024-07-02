from fastapi import FastAPI, HTTPException, Depends, Response
from fastapi.responses import FileResponse
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import pandas as pd
import uvicorn
import string
import secrets
from io import BytesIO
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

# Configuração do banco de dados FastAPI
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

# Configuração do envio de email com credenciais
conf = ConnectionConfig(
    MAIL_USERNAME="revoverybeaba@gmail.com",
    MAIL_PASSWORD="pwxi epul dued jdsi",
    MAIL_FROM="revoverybeaba@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

# Função para enviar e-mail
async def send_email(message: MessageSchema):
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        return {"message": "Email enviado com sucesso"}
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")
        raise HTTPException(status_code=500, detail="Erro ao enviar e-mail")

# Função para obter uma sessão de banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Modelos Pydantic
class EmailSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    email: EmailStr
    code: str
    newPassword: str

class Login(BaseModel):
    username: str
    password: str

# Funções auxiliares
def generate_reset_code(length=8):
    alphabet = string.ascii_letters + string.digits
    code = ''.join(secrets.choice(alphabet) for i in range(length))
    return code

# Endpoint para download de dados como Excel

@app.get('/download/{table_name}')
def download(table_name: str, db: Session = Depends(get_db)):
    try:
        # Executar a query e armazenar os dados em um DataFrame do pandas
        df = pd.read_sql_table(table_name, engine)
        
        # Verificar se o DataFrame está vazio
        if df.empty:
            raise HTTPException(status_code=404, detail=f"A tabela {table_name} está vazia")

        # Converter o DataFrame para um arquivo Excel em memória
        excel_io = BytesIO()
        df.to_excel(excel_io, index=False)
        excel_io.seek(0)
        
        # Enviar o arquivo Excel como resposta
        return StreamingResponse(
            excel_io,
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={'Content-Disposition': f'attachment; filename={table_name}.xlsx'}
        )
    except Exception as e:
        print(f"Erro ao gerar o arquivo Excel: {e}")
        raise HTTPException(status_code=500, detail="Erro ao gerar o arquivo Excel")

    
# Endpoints para recuperação e redefinição de senha (mantidos da implementação anterior)
@app.post("/api/forgot-password")
async def forgot_password(payload: EmailSchema, db: Session = Depends(get_db)):
    try:
        email = payload.email
        if not email:
            raise HTTPException(status_code=400, detail="Email não fornecido")

        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        reset_code = generate_reset_code()
        
        message = MessageSchema(
            subject="Redefinição de senha",
            recipients=[email],
            body=f"Seu código de redefinição de senha é: {reset_code}",
            subtype="plain"
        )

        await send_email(message)

        return {"message": "Email enviado com sucesso", "reset_code": reset_code}
    except Exception as e:
        print(f"Erro interno do servidor: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@app.post("/api/reset-password")
async def reset_password(payload: ResetPasswordSchema, db: Session = Depends(get_db)):
    try:
        email = payload.email
        code = payload.code
        new_password = payload.newPassword

        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        # Aqui você pode adicionar a lógica para verificar se o código de reset é válido

        # Atualizar a senha do usuário
        user.senha = new_password
        db.commit()

        return {"message": "Senha redefinida com sucesso"}
    except Exception as e:
        print(f"Erro interno do servidor: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@app.options("/api/forgot-password")  # Manipulador OPTIONS para lidar com pré-verificação CORS
async def options_forgot_password():
    return {"Allow": "POST"}

@app.options("/api/reset-password")  # Manipulador OPTIONS para lidar com pré-verificação CORS
async def options_reset_password():
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
    uvicorn.run(app, host="localhost", port=5000)
