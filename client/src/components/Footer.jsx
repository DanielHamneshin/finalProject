import React from 'react';
import style from "../styles/footer.module.css"

const Footer = () => {
    return (<>
        <footer className={style.footer}>
            <div className={style.column}>
                <h4>University</h4>
                <p>Landmark Education</p>
            </div>

            <div className={style.column}>
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="#">Work</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Products</a></li>
                    <li><a href="#">Tips & Tricks</a></li>
                </ul>
            </div>

            <div className={style.column}>
                <h4>Programs</h4>
                <ul>
                    <li><a href="#">Air freight</a></li>
                    <li><a href="#">Ocean freight</a></li>
                    <li><a href="#">Large projects</a></li>
                </ul>
            </div>

            <div className={style.column}>
                <h4>Resources</h4>
                <ul>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Submit Ticket</a></li>
                    <li><a href="#">Contact Us</a></li>
                </ul>
            </div>

            <div className={`${style.column} ${style.newsletter}`}>
                <h4>Newsletter</h4>
                <p>Subscribe to our newsletter to get updates.</p>
                <form onSubmit={(e) => {
                    e.preventDefault();
                }}>
                    <input type="email" placeholder="Enter your email" required />
                    <button type="submit">&gt;</button>
                </form>
                <div className={style.icons}
                >
                    <a href="#">&#xf09a;</a> {/* Facebook */}
                    <a href="#">&#xf16d;</a> {/* Instagram */}
                    <a href="#">&#xf0e1;</a> {/* LinkedIn */}
                    <a href="#">&#xf16a;</a> {/* YouTube */}
                </div>
            </div>

            <div className={`${style.column} ${style.copyright}`}>
                <p>Copyright &copy; 2024 All rights reserved | This template is made with <span style={{ color: '#28a745' }}>&hearts;</span> by Colorlib</p>
            </div >
        </footer >
    </>
    );
};

export default Footer;