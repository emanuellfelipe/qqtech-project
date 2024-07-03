import React from 'react';
import Image from 'next/image';
import "/src/styles/footer.css"; 

export default function Footer() {
    return (
        <footer>
            <p>Lojas Quero Quero @ 2024</p>
            <div id="social-icons">
                <Image src="/images/facebook-icon.png" alt="Facebook" width={20} height={20} />
                <Image src="/images/instagram-icon.png" alt="Instagram" width={20} height={20} />
                <a href="https://www.linkedin.com/company/lojas-quero-quero-s-a/mycompany/" target="_blank" rel="noopener noreferrer">
                    <Image src="/images/linkedin-icon.png" alt="LinkedIn" width={20} height={20} />
                </a>
                <Image src="/images/youtube-icon.png" alt="YouTube" width={20} height={20} />
            </div>
        </footer>
    );
}
