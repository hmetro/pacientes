import App from '../app';
import m from 'mithril';
import Loader from '../loader';
import printJS from 'print-js';

class ButtonHelp {
    static help = false;
};

class ButtonShare {
    static help = false;
};


class verDocPDF {
    static url = "";
    static show = "";
    static numPage = 0;
    static tab = "active show";
    static tabImagen = "";
    static pdfDoc = null;
    static pageNum = 1;
    static pageRendering = false;
    static pageNumPending = null;
    static scale = 1.25;
    static canvas = null;
    static ctx = null;
    static renderPage(num) {

        verDocPDF.pageRendering = true;
        // Using promise to fetch the page
        verDocPDF.pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport({
                scale: verDocPDF.scale,
            });
            verDocPDF.canvas.height = viewport.height;
            verDocPDF.canvas.width = viewport.width;
            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: verDocPDF.ctx,
                viewport: viewport,
            };
            var renderTask = page.render(renderContext);
            // Wait for rendering to finish
            renderTask.promise.then(function () {
                verDocPDF.pageRendering = false;
                if (verDocPDF.pageNumPending !== null) {

                    // New page rendering is pending
                    verDocPDF.renderPage(verDocPDF.pageNumPending);
                    verDocPDF.pageNumPending = null;

                } else {

                    $('.preloader').fadeOut('slow', function () {
                        $(this).hide();
                    });


                    if (!(window.matchMedia('(min-width: 992px)').matches)) {

                    } else {
                        $('#render-pdf').css("width", "100%");
                    }





                }
            });
        });
        // Update page counters
        // document.getElementsByClassName('page_num').textContent = num;
        $(".page_num").text(num);

    }
    static queueRenderPage(num) {
        if (verDocPDF.pageRendering) {
            verDocPDF.pageNumPending = num;
        } else {
            verDocPDF.renderPage(num);
        }
    }
    static onPrevPage() {
        if (verDocPDF.pageNum <= 1) {
            return;
        }
        verDocPDF.pageNum--;
        verDocPDF.queueRenderPage(verDocPDF.pageNum);
    }
    static onNextPage() {
        if (verDocPDF.pageNum >= verDocPDF.pdfDoc.numPages) {
            return;
        }
        verDocPDF.pageNum++;
        verDocPDF.queueRenderPage(verDocPDF.pageNum);
    }
    static loadDocument(_url) {

        DetalleClinico.inZoom = "d-none";
        verDocPDF.url = _url;
        verDocPDF.show = "d-none";

        setTimeout(function () {

            $(".doc-loader").show();
            $(".doc-content").hide();
            $(".doc-control").hide();
            // If absolute URL from the remote server is provided, configure the CORS
            // Loaded via <script> tag, create shortcut to access PDF.js exports.
            var pdfjsLib = window["pdfjs-dist/build/pdf"];
            // The workerSrc property shall be specified.
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                "assets/dashforge/lib/pdf.js/build/pdf.worker.js";

            verDocPDF.canvas = document.getElementById("render-pdf");
            verDocPDF.ctx = verDocPDF.canvas.getContext("2d");

            pdfjsLib
                .getDocument({
                    url: verDocPDF.url,
                })
                .promise.then(function (pdfDoc_) {
                    verDocPDF.pdfDoc = pdfDoc_;
                    $(".page_count").text(verDocPDF.pdfDoc.numPages);

                    // Initial/first page rendering
                    setTimeout(function () {
                        $(".doc-loader").hide();
                        $(".doc-content").show();
                        $(".doc-control").show();
                        if (verDocPDF.pdfDoc.numPages == 1) {
                            verDocPDF.numPage = 1;
                        }
                        verDocPDF.renderPage(verDocPDF.pageNum);
                    }, 100);

                    if (verDocPDF.pdfDoc.numPages > 1) {
                        verDocPDF.numPage = verDocPDF.pdfDoc.numPages;
                    }
                });


        }, 900);

    }

    view() {

        if (verDocPDF.url.length !== 0) {

            return [
                m("div.col-lg-12.text-center[id='docPDF']", [
                    m("div.doc-control.row.mb-0.p-0.w-100", [

                        m("div.row.col-12.d-block.text-light-dark", { style: { "font-size": "20px" } }, [
                            " Página: ",
                            m("span.page_num",),
                            " / ",
                            m("span.page_count",)
                        ]),

                    ]),
                    m("div.doc-loader.row.col-12", { "style": { "display": "none" } },
                        m("div..col-12.pd-5",
                            m("div.preloader-inner",
                                m("div.loader-content",
                                    m("span.icon-section-wave.d-inline-block.text-active.mt-3.",),
                                )
                            ),
                        )
                    ),
                    m("div.doc-content.row.col-12.pd-0.", { "style": { "display": "flex" } },
                        m("div.d-flex.justify-content-start.pd-0.mg-0.w-100",
                            m("canvas[id='render-pdf']", {})
                        )
                    ),

                ]),

            ]
        }


    }




}


class _QR {
    static data = [];
    static detalle = [];
    static error = "";
    static showFor = "";
    static loader = false;
    static verResultado(url) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        _QR.loader = false;
        MenuBoton.typeDoc = 'LAB';
        verDocPDF.show = "";
        verDocPDF.loadDocument(url);
        m.redraw();
    }
    static fetchResultado(url) {
        m.request({
            method: "GET",
            url: url,

        })
            .then(function (result) {
                _QR.loader = false;
                if (result.status !== undefined && result.status) {
                    window.open(result.url);
                } else {
                    _QR.error = "Resultado no disponible.";
                    setTimeout(function () { _QR.error = ""; }, 5000);
                }

            }).catch(function (e) {
                alert("Resultado no disponible.");
                _QR.loader = false;
                verDocPDF.show = "";
                _QR.error = "";
            });

    }
    static imprimirResultado(url) {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        m.request({
            method: "GET",
            url: url,

        })
            .then(function (result) {
                _QR.loader = false;
                if (result.status !== undefined && result.status) {
                    printJS(result.url)
                } else {
                    _QR.error = "Resultado no disponible.";
                    setTimeout(function () { _QR.error = ""; }, 5000);
                }

            }).catch(function (e) {
                alert("Resultado no disponible.");
                _QR.loader = false;
                verDocPDF.show = "";
                _QR.error = "";
            });

    }
    static verResultado(url) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        _QR.loader = false;
        MenuBoton.typeDoc = 'LAB';
        verDocPDF.show = "";
        verDocPDF.loadDocument(url);
        m.redraw();
    }

    static verQR(_data) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        _QR.loader = false;
        _QR.data = _data;
        MenuBoton.typeDoc = 'LAB';
    }

    oninit() {

        _QR.loader = true;
        _QR.verQR(DetalleClinico.data);

    }

    view() {



        return _QR.error ? [
            m(".tab-pane.mt-5.fade.active.show[id='v-pills-lab'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-laboratory.mr-2"),
                    "Resultados de _QR:"
                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m(".alert.alert-danger[role='alert']",
                    _QR.error
                )
            ]),
        ] : (_QR.data.length !== 0 && !_QR.loader) ? [
            m(".tab-pane.fade.active.show[id='v-pills-lab'][role='tabpanel']", {
                class: "mt-0",
            }, [
                m("img.p-1.mb-2[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='200rem']"),

                m("h4.m-text-2",
                    m("i.icofont-qr-code.mr-2"), "Código QR:"

                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m("h2.m-text-2.text-center",
                    "Perfil del Paciente"

                ),

                m("div", {
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
                                            m("h5.m-text-2.mb-3",
                                                m("p.designation", [
                                                    " ¿Mi resultado tiene inconsitencias? ",
                                                ]),
                                            ),

                                        ]),
                                    ]),


                                ),


                            ]),

                        ),

                    ])
                ),
                m("div.m-text-2.text-center",
                    m("img[widht='120%'][height='120%']", {
                        oncreate: (el) => {
                            el.dom.src = "data:image/png;base64," + _QR.data;
                        }
                    }),

                ),
                m("h5.text-center.text-light-dark.ff-roboto.pb-40.mb-0",
                    "NHC: " + DetalleClinico.paciente.CD_PACIENTE
                ),


            ]),
        ] : [
            m(".tab-pane.mt-5.fade.active.show[id='v-pills-lab'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-laboratory.mr-2"),
                    "Código QR:"
                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m("div.text-center", [
                    m("div.loader-content",
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3.",)
                    )
                ])
            ]),
        ]





    }

};

class MenuBoton {
    static show = "";
    static close = "d-none";
    static zoomin = "d-none";
    static zoomout = "d-none";
    static reload = "d-none";
    static zi = "";
    static update = "";
    static typeDoc = "LAB";
    static setComand() {



        if (MenuBoton.update == "LAB") {
            _QR.fetch();
        }




    }
    onupdate(_data) {
        m.redraw();
    }

    view() {

        if (MenuBoton.show.length === 0) {

            if (MenuBoton.typeDoc == 'LAB') {

                if (verDocPDF.numPage === 1) {
                    return [

                        m("div.button-menu-right-p1", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Descargar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();

                                    window.open(verDocPDF.url)


                                },
                            },
                                m("i.icofont-download", { "style": { "font-size": "x-large" } })
                            )
                        ]),
                        ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [

                            m("div.button-menu-right-p2", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Ayuda"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        ButtonShare.help = false;
                                        ButtonHelp.help = !ButtonHelp.help;
                                    },
                                },
                                    m("i.icofont-question", { "style": { "font-size": "x-large" } })
                                )
                            ]),
                        ] : [
                            m("div.button-menu-right-p2", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Imprimir"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        printJS({
                                            printable: verDocPDF.url,
                                            type: 'pdf',

                                        })

                                    },
                                },
                                    m("i.icofont-print", { "style": { "font-size": "x-large" } })
                                )
                            ]),
                            m("div.button-menu-right-p3", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Compartir"),
                                m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        ButtonHelp.help = false;
                                        ButtonShare.help = !ButtonShare.help;
                                    },
                                },
                                    m("i.icofont-share", { "style": { "font-size": "x-large" } })
                                )
                            ]),
                            m("div.button-menu-right-p4", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Ayuda"),
                                m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        ButtonShare.help = false;
                                        ButtonHelp.help = !ButtonHelp.help;
                                    },
                                },
                                    m("i.icofont-question", { "style": { "font-size": "x-large" } })
                                )
                            ]),

                        ]),




                    ]
                } else if (verDocPDF.numPage > 1) {
                    return [
                        m("div.button-menu-right-p1", { "style": { "display": "flex" } },
                            m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    verDocPDF.onNextPage();



                                },
                            },
                                m("i.fas.fa-chevron-circle-right"),
                                " Pág. Sig. "

                            )
                        ),
                        m("div.button-menu-left-plus", { "style": { "display": "flex" } },
                            m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    verDocPDF.onPrevPage();


                                },
                            },
                                m("i.fas.fa-chevron-circle-left"),
                                " Pág. Ant. "

                            )
                        ),
                        m("div.button-menu-right-p2", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Descargar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();

                                    window.open(verDocPDF.url)


                                },
                            },
                                m("i.icofont-download", { "style": { "font-size": "x-large" } })
                            )
                        ]),
                        ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [

                            m("div.button-menu-right-p3", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Compartir"),
                                m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        ButtonHelp.help = false;
                                        ButtonShare.help = !ButtonShare.help;
                                    },
                                },
                                    m("i.icofont-share", { "style": { "font-size": "x-large" } })
                                )
                            ]),
                            m("div.button-menu-right-p4", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Ayuda"),
                                m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        ButtonShare.help = false;
                                        ButtonHelp.help = !ButtonHelp.help;
                                    },
                                },
                                    m("i.icofont-question", { "style": { "font-size": "x-large" } })
                                )
                            ]),

                        ] : [
                            m("div.button-menu-right-p3", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Imprimir"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        printJS({
                                            printable: verDocPDF.url,
                                            type: 'pdf',

                                        })

                                    },
                                },
                                    m("i.icofont-print", { "style": { "font-size": "x-large" } })
                                )
                            ]),
                            m("div.button-menu-right-p4", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Compartir"),
                                m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        ButtonHelp.help = false;
                                        ButtonShare.help = !ButtonShare.help;
                                    },
                                },
                                    m("i.icofont-share", { "style": { "font-size": "x-large" } })
                                )
                            ]),
                            m("div.button-menu-right-p5", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Ayuda"),
                                m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        ButtonShare.help = false;
                                        ButtonHelp.help = !ButtonHelp.help;
                                    },
                                },
                                    m("i.icofont-question", { "style": { "font-size": "x-large" } })
                                )
                            ]),

                        ]),




                    ]
                } else {
                    return [
                        m("div.button-menu-right-p1", { "style": { "display": "flex" } }, [
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    window.location.reload();
                                },
                            },
                                m("i.icofont-refresh", { "style": { "font-size": "x-large" } })
                            )

                        ]

                        ),




                    ]
                }

            }

        } else {
            return [
                m("div.button-menu-right-p1", { "style": { "display": "flex" } }, [
                    m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                        onclick: (e) => {
                            e.preventDefault();
                            window.location.reload();
                        },
                    },
                        m("i.icofont-refresh", { "style": { "font-size": "x-large" } })
                    )

                ]

                ),




            ]
        }

    }
};

class DetalleClinico {
    static ver = true;
    static eliminar = false;
    static editar = false;
    static labelOperation = "Detalle:";
    static inZoom = "";
    static data = [];
    static detalle = [];
    static paciente = [];
    static error = "";
    oninit() {
        this.inZoom = '';
        this.fetch();
    }

    fetch() {
        DetalleClinico.data = [];
        DetalleClinico.error = "";
        m.request({
            method: "POST",
            url: "https://api.hospitalmetropolitano.org/t/v1/generate-qr-perfil-pte",
            body: {
                nhc: VisorPTEQR.nhc
            }

        })
            .then(function (result) {

                if (result === null) {
                    DetalleClinico.fetch();
                } else {

                    if (result.status) {
                        DetalleClinico.data = result.data;
                        DetalleClinico.paciente = result.paciente;
                    } else {
                        DetalleClinico.error = "No existe información disponible. Comuníquese con nuestra Mesa de Ayuda CONCAS. Ext: 2020.";
                    }
                }

            })
            .catch(function (e) {
                DetalleClinico.fetch();
            })
    }

    view() {


        return DetalleClinico.error ? [
            m('p.mt-2.ml-2', DetalleClinico.error)
        ] : (DetalleClinico.data.length !== 0) ? [
            m("section.intro-area.type-1.position-relative", {
                class: "m-bg-1",
            }, [
                m("div.container", {
                    class: "bg-white",
                    style: {
                        "height": "2500px"
                    }
                },
                    m("div.row", [

                        m("div", {
                            class: "col-md-12"
                        }, [
                            m("div.tab-content.m-pb-140.", {
                                class: "m-pt-40"
                            }, [

                                m(_QR),
                            ])
                        ])
                    ]),
                    m(MenuBoton)
                ),

            ])
        ] : [m(Loader, { loaderPage: true })]

    }

}

class VisorPTEQR extends App {
    static nhc = null;
    constructor() {
        super();
    }
    oninit(_data) {

        if (_data.attrs.nhc !== undefined) {
            VisorPTEQR.nhc = _data.attrs.nhc;
        }

        this._setTitle = "Código QR - Perfil del Paciente";

    }


    view() {


        return [
            m(DetalleClinico)
        ];

    }



};

export default VisorPTEQR;