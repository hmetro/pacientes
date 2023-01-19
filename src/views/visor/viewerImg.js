import App from "../app";

class ButtonHelp {
    static help = false;
};

class ButtonShare {
    static help = false;
};


class VisorRis {
    static show = "";
    static url = "";
    static idExamen = "";
    static loader = true;
    oninit() {


        m.request({
                method: "POST",
                url: "https://api.hospitalmetropolitano.org/t/v1/check-point-rx",
                body: {
                    id: ViewerImg.id
                },

            })
            .then(function(result) {

                if (result.status) {
                    VisorRis.idExamen = result.id;
                    ViewerImg.hashId = result.hashReport;




                } else {
                    alert('No pudimos procesar esta petición. Escríbenos a nuestra Mesa de Ayuda concas@hmetro.med.ec. Tel: 02 399 8000 Ext: 2020.');
                }

            })
            .catch(function(e) {

            });

    }
    view() {

        document.cookie = "cookieName=; Path=/; domain=https://imagen.hmetro.med.ec; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        VisorRis.url = "https://imagen.hmetro.med.ec/zfp?Lights=on&mode=proxy#view&ris_exam_id=" + VisorRis.idExamen + "&un=WEBAPI&pw=lEcfvZxzlXTsfimMMonmVZZ15IqsgEcdV%2forI8EUrLY%3d";

        return [
            m("div.p-4", {
                    class: (VisorRis.loader ? '' : 'd-none')
                },
                m("div.row",
                    m("div.col-md-6.offset-md-3",
                        m("div.text-center", [
                            m("img.p-1.mb-2[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='200rem']"),
                            m("h4.m-text-2",
                                m("i.icofont-file-image.mr-2"), "Visor de Resultados:"
                            ),
                        ])
                    )
                ),
                m("div.row.m-pt-20.m-pb-60", [
                    m("div.col-12.pd-r-0.pd-l-0.pd-b-20",
                        m("div.row.m-mb-60.m-mt-10.", [
                            m("div.col-12",

                                m("div.text-left", {

                                }, [
                                    m("h3.d-inline-block.mt-3", 'Instrucciones para el uso del Visor de Resultados:'),

                                    m("div.bg-white.mb-0.position-relative.has-float-icon.pt-4.pl-4.pb-4.pr-4.info-box.m-mtb-20.radius-5", [
                                        ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [

                                            m("img.p-1.mb-2[src='assets/soporteVisor.png'][alt='Metrovirtual'][width='100%']"),



                                        ] : [
                                            m("img.p-1.mb-2[src='assets/soporteVisor.png'][alt='Metrovirtual'][width='30%']"),




                                        ]),

                                        m("h4.m-text-2.mt-2.mb-3",
                                            m(".", [
                                                m("i.icofont-checked.mr-2"),
                                                " Verifique que su versión de navegador esté dentro de los requeridos. ",
                                            ]),
                                        ),
                                        m("h4.m-text-2.mt-2.mb-3",
                                            m(".", [
                                                m("i.icofont-checked.mr-2"),
                                                " Si Ud se encuentra en su trabajo u oficina, verifique que su conexión a Internet no esté siendo filtrada por ningún Firewall Corporativo. ",
                                            ]),
                                        ),
                                        m("h4.m-text-2.mt-2.mb-5",
                                            m(".", [
                                                m("i.icofont-checked.mr-2"),
                                                " Si persisten los inconvenientes al visualizar su información utilice nuestro botón de Ayuda.",
                                            ]),
                                        ),
                                        m("div.text-center.mb-3", [
                                            m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                                    style: {
                                                        "cursor": "pointer"
                                                    },
                                                    onclick: (e) => {
                                                        VisorRis.loader = false;
                                                    },
                                                },
                                                m("i.icofont-hand-right.mr-2", { "style": { "font-size": "x-large" } }),
                                                " Continuar"
                                            )

                                        ]),


                                    ]),


                                ]),





                            ),


                        ]),

                    ),

                ])
            ),

            m("div", {
                class: (VisorRis.loader ? 'd-none' : '')
            }, [
                m("div", {
                    class: ((ButtonHelp.help || ButtonShare.help) ? 'd-none' : '')
                }, [
                    m("iframe", {
                        src: VisorRis.url,
                        "style": {
                            "frameborder": "0",
                            "width": "100%",
                            "height": "70vh"
                        }
                    }),

                ]),
            ]),


            m("div.p-4", {
                    class: (ButtonHelp.help ? '' : 'd-none')
                },
                m("div.row",
                    m("div.col-md-6.offset-md-3",
                        m("div.text-center", [
                            m("h2.m-0.text-dark",
                                "Ayuda"
                            ),
                            m("span.d-inline-block.mt-3.active", 'Opciones disponibles')
                        ])
                    )
                ),


                m("div.row.m-pt-20.m-pb-60.m-mt-20", [
                    m("div.col-12.pd-r-0.pd-l-0.pd-b-20",
                        m("div.row.m-mb-60.m-mt-10.", [
                            m("div.col-12",
                                m("div", {
                                    style: { "cursor": "pointer" },
                                    onclick: (e) => {
                                        alert("Escríbanos a nuestra Mesa de Ayuda CONCAS. Tel: 02 399 8000 Ext.: 2020");
                                        window.open("mailto:concas@hmetro.med.ec?subject=METRO%20VIRTUAL%20WEB%3A%20Mi%20resultado%20tiene%20inconsistencias&body=Mi%20resultado%20tiene%20inconsistencias.%0A%0AEnlace%20de%20Resultado%3A%0A" + encodeURI(window.location.href));

                                    },
                                }, [
                                    m("div.bg-white.mb-0.position-relative.has-float-icon.pt-4.pl-4.pb-4.pr-4.info-box.m-mtb-20.radius-5", [
                                        m("div.features-circle.mb-3.m-bg-3.text-active.d-inline-flex.align-items-center.justify-content-center.rounded-circle",
                                            m("i.icofont-page")
                                        ),
                                        m("h3.m-text-2.mb-3",
                                            m(".", [
                                                " ¿Mi resultado tiene inconsistencias? ",
                                            ]),
                                        ),

                                    ]),
                                ]),


                            ),


                        ]),

                    ),

                ])
            ),
            m("div.p-4", {
                    class: (ButtonShare.help ? '' : 'd-none')
                },
                m("div.row",
                    m("div.col-md-6.offset-md-3",
                        m("div.text-center", [
                            m("h2.m-0.text-dark",
                                "Compartir"
                            ),
                            m("span.d-inline-block.mt-3.active", 'Opciones disponibles')
                        ])
                    )
                ),


                m("div.row.m-pt-20.m-pb-60.m-mt-20", [
                    m("div.col-12.pd-r-0.pd-l-0.pd-b-20",
                        m("div.row.m-mb-60.m-mt-10.", [
                            m("div.col-12",

                                m("div", {
                                    style: { "cursor": "pointer" },
                                    onclick: (e) => {

                                        alert('Comparte este resultado por correo electrónico con quien lo necesites.');
                                        let correo = prompt("Correo electrónico:");
                                        if (correo != null) {
                                            window.open("mailto:" + correo + "?subject=Te%20comparto%20mi%20resultado%20MetroVirtual&body=Te%20comparto%20mi%20resultado%20MetroVirtual.%0A%0AClic%20en%20este%20enlace%20para%20m%C3%A1s%20informaci%C3%B3n.%0A" + encodeURI(window.location.href));
                                        }
                                    },
                                }, [
                                    m("div.bg-white.mb-0.position-relative.has-float-icon.pt-4.pl-4.pb-4.pr-4.info-box.m-mtb-20.radius-5", [
                                        m("div.features-circle.mb-3.m-bg-3.text-active.d-inline-flex.align-items-center.justify-content-center.rounded-circle",
                                            m("i.icofont-send-mail")
                                        ),
                                        m("h3.m-text-2.mb-3",
                                            m(".", [
                                                " Compartir por correo electrónico ",
                                            ]),
                                        ),

                                    ]),
                                ]),

                                m("div", {
                                    style: { "cursor": "pointer" },
                                    onclick: (e) => {


                                        alert('Comparte este resultado por Whatsapp con quien lo necesites.');
                                        let celular = prompt("Número celular: Ej: 0998786402");
                                        if (celular != null) {
                                            let cel = celular.slice(1);
                                            window.open("https://api.whatsapp.com/send?phone=593" + cel + "&text=Te%20comparto%20mi%20resultado%20MetroVirtual%0A%0AClic%20en%20este%20enlace%20para%20m%C3%A1s%20informaci%C3%B3n%3A%0A%0A" + encodeURI(window.location.href));
                                        }
                                    },
                                }, [
                                    m("div.bg-white.mb-0.position-relative.has-float-icon.pt-4.pl-4.pb-4.pr-4.info-box.m-mtb-20.radius-5", [
                                        m("div.features-circle.mb-3.m-bg-3.text-active.d-inline-flex.align-items-center.justify-content-center.rounded-circle",
                                            m("i.icofont-whatsapp")
                                        ),
                                        m("h3.m-text-2.mb-3",
                                            m(".", [
                                                " Compartir por Whatsapp",
                                            ]),
                                        ),

                                    ])
                                ]),



                            ),


                        ]),

                    ),

                ])
            ),

            m("div.text-center", { "style": { "display": (!VisorRis.loader && ViewerImg.hashId !== null ? "block" : "none"), "right": "9rem", "margin-bottom": "150px" } }, [
                    m("a.btn.fadeInDown-slide.position-relative.animated.mr-2.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2[href='/resultado/i/" + ViewerImg.hashId + "'][target='_blank']", {

                    }, [
                        m("i.icofont-file-alt.mr-2"),

                        " Ver Informe"

                    ]),
                    m("button.btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2[href='/resultado/i/" + ViewerImg.hashId + "'][target='_blank']", {
                        onclick: (e) => {
                            ButtonHelp.help = false;
                            ButtonShare.help = !ButtonShare.help;
                        }
                    }, [
                        m("i.icofont-share.mr-2"),

                        "Compartir"

                    ])
                ]

            ),
            m("div.button-menu-left-copy.mt-10", { "style": { "display": "flex" } },
                m("div", [


                    m("img.pb-1.mt-10[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='150rem']"),
                    m("p.m-text-2.pb-1.m-0",
                        m("i.icofont-image.mr-2"), "Visor de Resultados:"

                    )


                ]),
            ),
            m("div.button-menu-right-p1", { "style": { "display": "flex" } },
                m("button.btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2[type='button']", {
                    onclick: () => {
                        ButtonShare.help = false;
                        ButtonHelp.help = !ButtonHelp.help;
                    },
                }, [
                    m("i.icofont-question"),
                    " Ayuda "
                ])
            ),

        ]

    }

};


class ViewerImg extends App {
    static id = null;
    static hashId = null;
    constructor() {
        super();
    }
    oninit(_data) {

        if (_data.attrs.id !== undefined) {
            ViewerImg.id = _data.attrs.id;
            let _params = m.parseQueryString(_data.attrs.id);
            ViewerImg.id = Object.keys(_params)[0];
        }

        this._setTitle = "Visor de Resultados";

    }


    view() {

        return [
            m("header",
                m("div..position-relative.set-bg.breadcrumb-container", { "style": { "background-position": "center center", "background-size": "cover", "background-repeat": "no-repeat" } }, [
                    m("div.overlay.op-P9"),
                    m("div.container",
                        m("div.row",
                            m("div.col-md-12", )
                        )
                    )
                ])
            ),
            m(VisorRis)
        ];

    }



};

export default ViewerImg;