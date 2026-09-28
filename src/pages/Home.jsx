
export default function Home() {
    return (
        <>
            <section className="hero">
                <div className="hero-text">
                    <span className="badge">AGUA POTABLE PARA TODOS</span>

                    <h1>
                        El agua es un <span className="highlight">derecho</span>,<br />
                        no un privilegio.
                    </h1>

                    <p>
                        Water Seven localiza fuentes de agua potable,
                        guía su purificación y conecta comunidades.
                    </p>

                    <div className="buttons">
                        <button className="btn-primary">Encontrar agua</button>
                    </div>

                    <div className="stats">
                        <div>
                            <h3>200M</h3>
                            <p>Sin acceso</p>
                        </div>
                        <div>
                            <h3>3.500M</h3>
                            <p>Sin saneamiento</p>
                        </div>
                        <div>
                            <h3>1.4M</h3>
                            <p>Muertes al año</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="problematica">
                <h2>La crisis del agua en cifras</h2>
                <p className="subtitle">Datos reales de la OMS y UNICEF que muestran por qué nace Water Seven</p>

                <div className="cifras-grid">
                    <div className="cifra-card">
                        <i className="fas fa-tint"></i>
                        <h3>200 millones</h3>
                        <p>de personas carecen de acceso a agua potable gestionada de forma segura. <strong>115 millones</strong> beben agua directamente de fuentes superficiales.</p>
                        <span className="fuente">OMS/UNICEF 2023</span>
                    </div>
                    <div className="cifra-card">
                        <i className="fas fa-toilet"></i>
                        <h3>3.500 millones</h3>
                        <p>de personas aún carecen de servicios de saneamiento gestionados de forma segura. <strong>419 millones</strong> practican la defecación al aire libre.</p>
                        <span className="fuente">OMS/UNICEF 2023</span>
                    </div>
                    <div className="cifra-card">
                        <i className="fas fa-heartbeat"></i>
                        <h3>1.4 millones</h3>
                        <p>de personas mueren cada año por enfermedades relacionadas con el agua. <strong>1.000 niños</strong> menores de 5 años mueren cada día.</p>
                        <span className="fuente">OMS 2023</span>
                    </div>
                    <div className="cifra-card">
                        <i className="fas fa-industry"></i>
                        <h3>80%</h3>
                        <p>de las aguas residuales regresa al ecosistema <strong>sin ser tratada ni reutilizada</strong>, contaminando fuentes de agua naturales.</p>
                        <span className="fuente">ONU-Agua 2018</span>
                    </div>
                    <div className="cifra-card">
                        <i className="fas fa-globe-americas"></i>
                        <h3>10%</h3>
                        <p>de la población mundial vive en países con <strong>estrés hídrico alto o crítico</strong>, sin suficiente agua para cubrir sus necesidades básicas.</p>
                        <span className="fuente">FAO/ONU-Agua</span>
                    </div>
                    <div className="cifra-card">
                        <i className="fas fa-hand-holding-water"></i>
                        <h3>2 de cada 3</h3>
                        <p>personas en el mundo viven con <strong>escasez de agua</strong> al menos un mes al año. La crisis afecta desproporcionadamente a zonas rurales.</p>
                        <span className="fuente">UNESCO 2023</span>
                    </div>
                </div>

                <div className="impacto-imagenes">
                    <div className="impacto-item">
                        <img src="/imagenes/recolectando-agua.jpg" alt="Personas recolectando agua en zona rural" />
                        <p>Millones de personas caminan horas cada día para conseguir agua</p>
                    </div>
                    <div className="impacto-item">
                        <img src="/imagenes/agua-contaminada.jpg" alt="Agua contaminada" />
                        <p>El 80% de las aguas residuales se vierte sin tratamiento</p>
                    </div>
                    <div className="impacto-item">
                        <img src="/imagenes/sequia.jpg" alt="Sequía y tierra seca" />
                        <p>La sequía afecta a comunidades enteras en todo el mundo</p>
                    </div>
                </div>
            </section>

            <section className="mision">
                <div className="mision-content">
                    <h2>Nuestra misión</h2>
                    <p>
                        Water Seven nace para enfrentar esta crisis. Usamos tecnología accesible para
                        <strong> localizar fuentes de agua potable</strong>, brindar
                        <strong> guías de purificación</strong> y conectar comunidades a través de un
                        <strong> chat de comunicación</strong>. Creemos que el agua es un derecho humano,
                        no un privilegio.
                    </p>
                    <div className="mision-stats">
                        <div>
                            <i className="fas fa-map-marked-alt"></i>
                            <h4>Localizamos</h4>
                            <p>fuentes de agua cercanas</p>
                        </div>
                        <div>
                            <i className="fas fa-book-open"></i>
                            <h4>Educamos</h4>
                            <p>con guías de purificación</p>
                        </div>
                        <div>
                            <i className="fas fa-comments"></i>
                            <h4>Conectamos</h4>
                            <p>comunidades enteras</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
