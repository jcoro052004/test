import React, { useState } from "react";
import ImagenP from '../assets/guest.png';
import Imagen from '../assets/form.png';
import appFirebase from "../credenciales";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth(appFirebase);

const Login = () => {
    const [registrando, setRegistrando] = useState(false);
    const [error, setError] = useState(null);

    const functAutenticacion = async (e) => {
        e.preventDefault();
        const correo = e.target.email.value;
        const contraseña = e.target.password.value;

        try {
            if (registrando) {
                await createUserWithEmailAndPassword(auth, correo, contraseña);
            } else {
                await signInWithEmailAndPassword(auth, correo, contraseña);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleResetPassword = async () => {
        const correo = prompt("Por favor, ingresa tu correo electrónico para restablecer la contraseña:");
        if (correo) {
            try {
                await sendPasswordResetEmail(auth, correo);
                alert("Se ha enviado un correo de restablecimiento de contraseña. Por favor, verifica tu bandeja de entrada.");
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <div className="padre">
                        <div className="card card-body">
                            <img src={ImagenP} alt="" className="estilo-profile" />
                            <form onSubmit={functAutenticacion}>
                                <input type="text" placeholder='Email' className="cajatexto" id="email" />
                                <input type="password" placeholder='Contraseña' className="cajatexto" id="password" />
                                <button className="btnform">{registrando ? "Regístrate" : "Inicia sesión"}</button>
                            </form>
                            <h4 className="texto">{registrando ? "Si ya tienes cuenta " : "No tienes cuenta "}<button className="btnswitch" onClick={() => setRegistrando(!registrando)}>{registrando ? "Inicia sesión" : "Regístrate"}</button></h4>
                            <button className="btnrestart" onClick={handleResetPassword}>¿Olvidaste tu contraseña?</button> {/* Agrega el botón de restablecimiento de contraseña aquí */}
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <img src={Imagen} alt="" className="tamaño-imagen" />
                </div>
            </div>
        </div>
    );
};

export default Login;
