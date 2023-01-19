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
    static ampliar = false;
    static url = "";
    static show = "";
    static numPage = 0;
    static tab = "";
    static pdfDoc = null;
    static pageNum = 1;
    static pageRendering = false;
    static pageNumPending = null;
    static scale = 1;
    static canvas = null;
    static ctx = null;
    static renderPage(num) {

        verDocPDF.pageRendering = true;
        // Using promise to fetch the page
        verDocPDF.pdfDoc.getPage(num).then(function(page) {


            if (!(window.matchMedia('(min-width: 992px)').matches)) {
                verDocPDF.scale = 1.25;

            } else {
                verDocPDF.scale = 1;

            }

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
            renderTask.promise.then(function() {
                verDocPDF.pageRendering = false;
                if (verDocPDF.pageNumPending !== null) {

                    // New page rendering is pending
                    verDocPDF.renderPage(verDocPDF.pageNumPending);
                    verDocPDF.pageNumPending = null;

                } else {

                    $('.preloader').fadeOut('slow', function() {
                        $(this).hide();
                    });


                    if (!(window.matchMedia('(min-width: 992px)').matches)) {} else {
                        document.getElementById("render-pdf").style.width = "100%";
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
        verDocPDF.tab = "active show";

        setTimeout(function() {

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
                .promise.then(function(pdfDoc_) {
                    verDocPDF.pdfDoc = pdfDoc_;
                    $(".page_count").text(verDocPDF.pdfDoc.numPages);

                    // Initial/first page rendering
                    setTimeout(function() {
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

                m("div.col-12[id='docPDF']", [


                    m("div.text-center.doc-control.mb-0.p-0.w-100.mb-2", [


                        m("div.text-danger", { style: { "font-size": "20px" } }, [
                            " Página: ",
                            m("span.page_num"),
                            " de ",
                            m("span.page_count")
                        ]),




                    ]),
                    m("div.doc-loader.row.col-12", { "style": { "display": "none" } },
                        m("div..col-12.pd-5",
                            m("div.preloader-inner",
                                m("div.loader-content",
                                    m("span.icon-section-wave.d-inline-block.text-active.mt-3.", ),
                                )
                            ),
                        )
                    ),
                    m("div.doc-content.row.pd-0.", { "style": { "display": "flex" } },
                        m("div.d-flex.justify-content-start.pd-0.mg-0.w-100", {
                                "style": {
                                    "width": "100%",
                                    "height": "100%",
                                    "overflow-y": (!(window.matchMedia('(min-width: 992px)').matches) ? "scroll" : "none"),
                                },
                            },
                            m("canvas[id='render-pdf']", {
                                style: { "border": "2px solid #c4d1fa" },

                            })
                        )
                    ),

                ]),

            ]
        }


    }




}

class Imagen {
    static data = [];
    static detalle = [];
    static error = "";
    static showFor = "";
    static loader = false;
    static verResultado(url) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        Imagen.loader = false;
        MenuBoton.typeDoc = 'RX';
        verDocPDF.show = "";
        verDocPDF.loadDocument(url);
        m.redraw();
    }
    static fetchResultado(url) {
        m.request({
                method: "GET",
                url: url,
                headers: {
                    "Authorization": localStorage.accessToken,
                },
            })
            .then(function(result) {
                Imagen.loader = false;
                if (result.status !== undefined && result.status) {
                    window.open(result.url);
                } else {
                    Imagen.error = "Resultado no disponible.";
                    setTimeout(function() { Imagen.error = ""; }, 5000);
                }

            }).catch(function(e) {
                alert("Resultado no disponible.");
                Imagen.loader = false;
                verDocPDF.show = "";
                Imagen.error = "";
            });

    }
    static imprimirResultado(url) {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        m.request({
                method: "GET",
                url: url,
                headers: {
                    "Authorization": localStorage.accessToken,
                },
            })
            .then(function(result) {
                Imagen.loader = false;
                if (result.status !== undefined && result.status) {
                    printJS(result.url)
                } else {
                    Imagen.error = "Resultado no disponible.";
                    setTimeout(function() { Imagen.error = ""; }, 5000);
                }

            }).catch(function(e) {
                alert("Resultado no disponible.");
                Imagen.loader = false;
                verDocPDF.show = "";
                Imagen.error = "";
            });

    }

    oninit() {
        Imagen.data = DetalleClinico.data;
        Imagen.loader = true;
        Imagen.verResultado(DetalleClinico.data.url);

    }
    view() {



        return Imagen.error ? [
            m(".tab-pane.mt-5.fade.active.show[id='v-pills-lab'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-laboratory.mr-2"),
                    "Resultados de Imagen:"
                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m(".alert.alert-danger[role='alert']",
                    Imagen.error
                )
            ]),
        ] : (Imagen.data.length !== 0 && !Imagen.loader) ? [
            m(".tab-pane.fade.active.show[id='v-pills-lab'][role='tabpanel']", {
                class: "mt-0",

            }, [



                m("div.row", [
                    m("div.text-center.w-100", [
                        m("img.m-1.d-inline[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='200rem']"),
                        m("p.m-text-2.p-0.m-0",
                            m("i.icofont-image.mr-2"), "Visor de Resultados:"

                        ),

                    ])

                ]),




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
                m("div", {
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
                m("div",

                    m(verDocPDF),
                ),
            ]),
        ] : [
            m(".tab-pane.mt-5.fade.active.show[id='v-pills-lab'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-laboratory.mr-2"),
                    "Resultados de Imagen:"
                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m("div.text-center", [
                    m("div.loader-content",
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3.", )
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
    static typeDoc = "RX";
    static setComand() {



        if (MenuBoton.update == "RX") {
            Imagen.fetch();
        }

    }
    onupdate(_data) {
        m.redraw();
    }

    view() {

        if (MenuBoton.show.length === 0) {

            if (MenuBoton.typeDoc == 'RX') {

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
                            m("div.button-menu-right-p3", { "style": { "display": "flex" } }, [
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
                            (window.opener ? [
                                m("div.button-menu-right-p4", { "style": { "display": "flex" } }, [
                                    m("div.text-primary.mr-2", "Cerrar"),
                                    m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                            onclick: (e) => {
                                                window.close();
                                            },
                                        },
                                        m("i.icofont-close", { "style": { "font-size": "x-large" } })
                                    )
                                ])
                            ] : [])



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
                            (window.opener ? [
                                m("div.button-menu-right-p5", { "style": { "display": "flex" } }, [
                                    m("div.text-primary.mr-2", "Cerrar"),
                                    m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                            onclick: (e) => {
                                                window.close();
                                            },
                                        },
                                        m("i.icofont-close", { "style": { "font-size": "x-large" } })
                                    )
                                ])
                            ] : []),


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
                            (window.opener ? [
                                m("div.button-menu-right-p5", { "style": { "display": "flex" } }, [
                                    m("div.text-primary.mr-2", "Cerrar"),
                                    m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                            onclick: (e) => {
                                                window.close();
                                            },
                                        },
                                        m("i.icofont-close", { "style": { "font-size": "x-large" } })
                                    )
                                ])
                            ] : [])

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
                            (window.opener ? [
                                m("div.button-menu-right-p6", { "style": { "display": "flex" } }, [
                                    m("div.text-primary.mr-2", "Cerrar"),
                                    m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                            onclick: (e) => {
                                                window.close();
                                            },
                                        },
                                        m("i.icofont-close", { "style": { "font-size": "x-large" } })
                                    )
                                ])
                            ] : [])

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
    static error = "";

    oninit() {
        this.inZoom = '';
        this.fetch();
    }

    fetch() {
        DetalleClinico.data = [];
        DetalleClinico.error = "";
        m.request({
                method: "GET",
                url: "https://api.hospitalmetropolitano.org/v2/pacientes/resultado/i/?id=" + VisorImg.id,
                headers: {
                    "Authorization": localStorage.accessToken,
                },
            })
            .then(function(result) {

                if (result === null) {
                    DetalleClinico.fetch();
                } else {

                    if (result.status) {
                        DetalleClinico.data = result;

                    } else {
                        DetalleClinico.error = "No existe información disponible. La ubicación del paciente ya no es Emergencia.";
                    }
                }

            })
            .catch(function(e) {
                DetalleClinico.fetch();
            })
    }

    view() {


        return DetalleClinico.error ? [
            m('p', 'error')
        ] : (DetalleClinico.data.length !== 0) ? [
            m("section.intro-area.type-1.position-relative", {
                class: "m-bg-1",
            }, [
                m("div.container", {
                        class: "bg-white",

                    },
                    m("div.row", [

                        m("div", {
                            class: "col-md-12"
                        }, [
                            m("div.tab-content.m-pb-140.", {
                                class: "mt-3"
                            }, [

                                m(Imagen),
                            ])
                        ])
                    ]),
                    m(MenuBoton)
                ),

            ])
        ] : [m(Loader, { loaderPage: true })]

    }

}

class VisorImg extends App {
    static id = null;
    constructor() {
        super();
    }
    oninit(_data) {

        if (_data.attrs.id !== undefined) {
            VisorImg.id = _data.attrs.id;
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
                ]),

            ),
            m(DetalleClinico)
        ];

    }



};

export default VisorImg;