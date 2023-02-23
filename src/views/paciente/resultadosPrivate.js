import HeaderPrivate from '../layout/header-public';
import App from '../app';
import m from 'mithril';
import Loader from '../loader';

class VisorRis {
    static show = "";
    static url = "";
    view() {


        document.cookie = "cookieName=; Path=/; domain=https://imagen.hmetro.med.ec; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        VisorRis.url = "https://imagen.hmetro.med.ec/zfp?Lights=on&mode=proxy#view&pid=" + ResultadoPaciente.nhc + "&un=WEBAPI&pw=lEcfvZxzlXTsfimMMonmVZZ15IqsgEcdV%2forI8EUrLY%3d";

        return [

            m("div", [

                m(".row",
                    m("div.w-100.position-relative.set-bg.breadcrumb-container", { "style": { "background-position": "center center", "background-size": "cover", "background-repeat": "no-repeat" } }, [
                        m("div.overlay.op-P9"),
                        m("div.container",
                            m("div.row",
                                m("div.col-md-12", )
                            )
                        )
                    ]),
                    m("div.col-12.d-flex", [

                        m("div.col-6.mt-2",
                            m("img.p-1.mb-2[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='200rem']"),

                            m("h6.m-text-2",
                                m("i.icofont-file-image.mr-2"), "Visor de Resultados"

                            ),

                        ),
                        m("div.col-6.text-right.mt-3",
                            m("a", {
                                    style: { "cursor": "pointer" },
                                    onclick: (e) => {
                                        e.preventDefault();

                                        VisorRis.show = "";

                                    },
                                },
                                m("div.d-inline.text-primary.mr-2", "Cerrar"),

                                m("div.features-circle.m-bg-3.text-active.d-inline-flex.align-items-center.justify-content-center.rounded-circle", { "style": { "height": "50px", "width": "50px" } },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })
                                )
                            )
                        )
                    ])
                ),
                m("iframe", {
                    src: VisorRis.url,
                    "style": {
                        "frameborder": "0",
                        "width": "100%",
                        "height": "85vh"
                    }
                })
            ]),


        ]
    }

};

class Imagen {
    static data = [];
    static detalle = [];
    static error = "";
    static showResultados = "d-none";
    static showButtons = "";
    static loader = true;
    static verResultado(url) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        verDocPDF.tabImagen = " active show ";
        Imagen.loader = true;
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
                    verDocPDF.tabImagen = "active show";
                    verDocPDF.tab = "";
                    verDocPDF.typeDoc = 'RX';
                    verDocPDF.loadDocument(result.url);
                } else {
                    verDocPDF.tabImagen = "active show";
                    verDocPDF.tab = "";
                    Imagen.error = "Resultado definitivo no disponible. Comuníquese con nuestra Mesa de Ayuda CONCAS. Ext.: 2020";
                    setTimeout(function() { Imagen.error = ""; }, 5000);
                }

            })
            .catch(function(e) {
                Imagen.loader = false;
                Imagen.error = "Resultado definitivo no disponible. Comuníquese con nuestra Mesa de Ayuda CONCAS. Ext.: 2020";
                verDocPDF.tabImagen = "active show";
                verDocPDF.tab = "";
                setTimeout(function() { Imagen.error = ""; }, 5000);
            });

    }
    static imprimirResultado(url) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        Imagen.loader = true;
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
                    printJS({
                        printable: result.url,
                        type: 'pdf',
                    })
                } else {
                    verDocPDF.tabImagen = "active show";
                    verDocPDF.tab = "";
                    Imagen.error = "Resultado definitivo no disponible. Comuníquese con nuestra Mesa de Ayuda CONCAS. Ext.: 2020";
                    setTimeout(function() { Imagen.error = ""; }, 5000);
                }


            }).catch(function(e) {
                Imagen.loader = false;
                Imagen.error = "Resultado definitivo no disponible. Comuníquese con nuestra Mesa de Ayuda CONCAS. Ext.: 2020";
                verDocPDF.tabImagen = "active show";
                verDocPDF.tab = "";
                setTimeout(function() { Imagen.error = ""; }, 5000);
            });

    }
    static descargarResultado(url) {
        window.open(url)
    }
    static fetch() {
        Imagen.data = [];
        Imagen.error = "";
        Imagen.loader = true;
        m.request({
                method: "GET",
                url: "https://api.hospitalmetropolitano.org/v2/pacientes/resultados-img/" + ResultadoPaciente.nhc,
                headers: {
                    "Authorization": localStorage.accessToken,
                },
            })
            .then(function(result) {
                Imagen.loader = false;

                if (result.status && result.data.length !== 0) {
                    Imagen.data = result.data;
                } else {
                    Imagen.error = result.message;
                }
            })
            .catch(function(e) {
                Imagen.loader = false;
                Imagen.fetch();
            })
    }
    oninit() {
        Imagen.fetch();
    }
    view() {

        if (Imagen.loader) {
            return m(".tab-pane.mt-5.fade." + verDocPDF.tabImagen + "[id='v-pills-imagen'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-file-image.mr-2"),
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
            ]);
        } else {
            return [
                m(".tab-pane.fade." + verDocPDF.tabImagen + "[id='v-pills-imagen'][role='tabpanel']", {
                    class: (verDocPDF.show.length == 0) ? "mt-0" : "mt-0",
                }, [
                    [(verDocPDF.show.length == 0) ? [] : [
                        m("img.p-1.mb-2[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='200rem']")
                    ]],
                    m("h4.m-text-2.",
                        m("i.icofont-file-image.mr-2"), [(verDocPDF.show.length == 0) ? "Resultados de Imagen:" : "Visor de Resultados:"]
                    ),
                    m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                        "Hospital Metropolitano"
                    ),
                    m("h6.mb-5." + verDocPDF.show, [
                        "Resultados disponibles desde Enero, 2019.",
                    ]),
                    m("div." + Imagen.showButtons + ".row.p-1",
                        m("div.col-md-12",
                            m("div.single-service.type-1.radius-10.position-relative.service-wrapper.s-dp-10-60.m-mb-50.", {
                                    onclick: () => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });

                                        VisorRis.show = "d-none";
                                    },
                                    "style": { "cursor": "pointer" }
                                },
                                m("h4.text-dark2.mb-3.position-relative.pt-2", [
                                    "Ver Exámenes (Zero FootPrint GE) ",
                                ])
                            )
                        ),
                        (Imagen.data.length !== 0 ? [
                            m("div.col-md-12",
                                m("div.single-service.type-1.radius-10.position-relative.service-wrapper.s-dp-10-60.m-mb-50.", {
                                        onclick: () => {
                                            Imagen.showResultados = "";
                                            Imagen.showButtons = "d-none";
                                            MenuBoton.update = "RX";
                                        },
                                        "style": { "cursor": "pointer" }
                                    },
                                    m("h4.text-dark2.mb-3.position-relative.pt-2",
                                        "Ver Informes"
                                    )
                                )
                            ),
                        ] : [
                            m(".alert.alert-danger[role='alert']",
                                Imagen.error
                            )
                        ]),
                    ),
                    m("div." + Imagen.showResultados + ".row.p-1",
                        m("div.table-content.col-12.pd-r-0.pd-l-0.pd-b-20." + verDocPDF.show,
                            m("div.text-right", [
                                m("button.capsul.fz-poppins.text-default.radius-pill.active", {
                                    onclick: () => {
                                        Imagen.showResultados = "d-none";
                                        Imagen.showButtons = "";

                                    },
                                    "style": { "cursor": "pointer" }
                                }, [
                                    "<< Regresar"


                                ]),



                            ]),
                            m("table.table.table-sm.mt-2[width='100%']", { "style": { "width": "100%", "border-color": "transparent", "margin-bottom": "50px" } }, [
                                m("tbody", [
                                    Imagen.data.map(function(_v, _i, _contentData) {

                                        var _fechaHoy = moment(new Date()).format("DD-MM-YYYY");

                                        return [
                                            m("tr[role='row']", { "style": { "background-color": "transparent" } },
                                                m("td", { "style": { "border-color": "transparent", "padding": "0px" } },
                                                    m("div.row.bg-white.radius-5.p-2.article-tags", [
                                                        m("div.col-12.p-0.text-right", [
                                                            m("button.capsul.fz-poppins.text-default.radius-pill.active", {
                                                                title: " Ver Resultado ",
                                                                onclick: () => {
                                                                    Imagen.loader = true;
                                                                    Imagen.verResultado(_v.urlPdf);

                                                                },
                                                                "style": { "cursor": "pointer" }
                                                            }, [
                                                                m("i.icofont-eye-alt"),
                                                                " Ver "

                                                            ]),

                                                            ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [


                                                            ] : [
                                                                m("button.capsul.fz-poppins.text-default.radius-pill.active", {
                                                                    onclick: () => {
                                                                        Imagen.loader = true;
                                                                        Imagen.imprimirResultado(_v.urlPdf)
                                                                    },
                                                                    "style": { "cursor": "pointer" }
                                                                }, [
                                                                    m("i.icofont-print"),
                                                                    " Imprimir "
                                                                ])
                                                            ]),
                                                            m("a.capsul.fz-poppins.radius-pill.active", {
                                                                title: " Compartir Resultado ",
                                                                href: _v.deep_link,
                                                                target: "_blank",
                                                                style: { "cursor": "pointer", "display": "none" }
                                                            }, [
                                                                m("i.icofont-share"),
                                                                " Compartir "

                                                            ]),
                                                        ]),
                                                        m("div.col-lg-6.p-2", [
                                                            m("div", {
                                                                    "style": {
                                                                        "display": ((_fechaHoy == _v.FECHA) ? "block" : "none")
                                                                    }
                                                                },
                                                                m("span", {
                                                                        "style": { "color": "red" }
                                                                    },
                                                                    " Nuevo Resultado "
                                                                )
                                                            ),
                                                            m("span.d-block",
                                                                "Estudio: " + _v.ESTUDIO
                                                            ),
                                                            m("span.d-block",
                                                                " Fecha: " + _v.FECHA
                                                            ),
                                                        ]),


                                                    ])
                                                )
                                            )
                                        ]
                                    })
                                ])

                            ]),
                        ),
                    ),

                ])
            ]
        }

    }

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
        verDocPDF.pdfDoc.getPage(num).then(function(page) {
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
                m("div.col-lg-12.text-center[id='docPDF']", [
                    m("div.doc-control.row.mb-0.p-0.w-100", [

                        m("div.row.col-12.d-block.text-light-dark", { style: { "font-size": "20px" } }, [
                            " Página: ",
                            m("span.page_num", ),
                            " / ",
                            m("span.page_count", )
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

class Laboratorio {
    static data = [];
    static detalle = [];
    static error = "";
    static showFor = "";
    static loader = true;
    static verResultado(url) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        Laboratorio.loader = true;
        verDocPDF.tab = " active show ";
        m.request({
                method: "GET",
                url: url,
                headers: {
                    "Authorization": localStorage.accessToken,
                },
            })
            .then(function(result) {
                Laboratorio.loader = false;
                if (result.status !== undefined && result.status) {
                    verDocPDF.tab = "active show";
                    verDocPDF.tabImagen = "";
                    verDocPDF.typeDoc = 'LAB';
                    verDocPDF.loadDocument(result.url);
                } else {
                    Laboratorio.error = "Resultado definitivo no disponible. Comuníquese con nuestra Mesa de Ayuda CONCAS. Ext.: 2020";
                    verDocPDF.tab = "active show";
                    verDocPDF.tabImagen = "";
                    setTimeout(function() {
                        Laboratorio.error = "";
                    }, 5000);
                }

            })
            .catch(function(e) {

                Laboratorio.loader = false;
                Laboratorio.error = "Resultado definitivo no disponible. Comuníquese con nuestra Mesa de Ayuda CONCAS. Ext.: 2020";
                verDocPDF.tab = "active show";
                verDocPDF.tabImagen = "";
                setTimeout(function() {
                    Laboratorio.error = "";
                }, 5000);

            });

    }

    static imprimirResultado(url) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        Laboratorio.loader = true;

        m.request({
                method: "GET",
                url: url,
                headers: {
                    "Authorization": localStorage.accessToken,
                },
            })
            .then(function(result) {
                Laboratorio.loader = false;
                if (result.status !== undefined && result.status) {
                    printJS(result.url)
                } else {
                    Laboratorio.error = "Resultado definitivo no disponible. Comuníquese con nuestra Mesa de Ayuda CONCAS. Ext.: 2020";
                    verDocPDF.tab = "active show";
                    verDocPDF.tabImagen = "";
                    setTimeout(function() {
                        Laboratorio.error = "";
                    }, 5000);
                }

            }).catch(function(e) {
                Laboratorio.loader = false;
                Laboratorio.error = "Resultado definitivo no disponible. Comuníquese con nuestra Mesa de Ayuda CONCAS. Ext.: 2020";
                verDocPDF.tab = "active show";
                verDocPDF.tabImagen = "";
                setTimeout(function() {
                    Laboratorio.error = "";
                }, 5000);
            });

    }
    static fetch() {
        Laboratorio.data = [];
        Laboratorio.error = "";
        verDocPDF.url = "";
        Laboratorio.loader = true;

        m.request({
                method: "GET",
                url: "https://api.hospitalmetropolitano.org/v2/pacientes/resultados-laboratorio/" + ResultadoPaciente.nhc,
                headers: {
                    "Authorization": localStorage.accessToken,
                },
            })
            .then(function(result) {
                Laboratorio.loader = false;

                if (result.status && result.data.length !== 0) {
                    Laboratorio.data = result.data;
                } else {
                    Laboratorio.error = result.message;
                }

            })
            .catch(function(e) {
                Laboratorio.fetch();
            })
    }
    oninit() {
        Laboratorio.fetch();
    }
    view() {

        if (Laboratorio.loader) {
            return m(".tab-pane.mt-5.fade." + verDocPDF.tab + "[id='v-pills-lab'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-laboratory.mr-2"),
                    "Resultados de Laboratorio:"
                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m("div.text-center", [
                    m("div.loader-content",
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3.", )
                    )
                ])
            ]);
        } else {
            return Laboratorio.error ? [
                m(".tab-pane.mt-5.fade." + verDocPDF.tab + "[id='v-pills-lab'][role='tabpanel']", [
                    m("h4.m-text-2.",
                        m("i.icofont-laboratory.mr-2"),
                        "Resultados de Laboratorio:"
                    ),
                    m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                        "Hospital Metropolitano"
                    ),
                    m(".alert.alert-danger[role='alert']",
                        Laboratorio.error
                    )
                ]),
            ] : (Laboratorio.data.length !== 0) ? [
                m(".tab-pane.fade." + verDocPDF.tab + "[id='v-pills-lab'][role = 'tabpanel']", {
                    class: (verDocPDF.show.length == 0) ? "mt-0" : "",
                }, [
                    [(verDocPDF.show.length == 0) ? [] : [
                        m("img.p-1.mb-2[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='200rem']")
                    ]],
                    m("h4.m-text-2",
                        m("i.icofont-laboratory.mr-2"), [(verDocPDF.show.length == 0) ? "Resultados de Laboratorio:" : "Visor de Resultados:"]
                    ),
                    m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                        "Hospital Metropolitano"
                    ),



                    m("h6.mb-5." + verDocPDF.show, [
                        "Resultados disponibles desde Enero, 2019.",


                    ]),

                    m("div.row.p-1",
                        m("div.table-content.col-12.pd-r-0.pd-l-0.pd-b-20.w-100." + verDocPDF.show,
                            m("table.table.table-sm", { "style": { "width": "100%", "border-color": "transparent", "margin-bottom": "50px" } }, [
                                m("tbody", [
                                    Laboratorio.data.map(function(_v, _i, _contentData) {


                                        var _fechaHoy = moment(new Date()).format("DD-MM-YYYY");

                                        return [
                                            m("tr[role='row']", { "style": { "background-color": "transparent" } },
                                                m("td", { "style": { "border-color": "transparent", "padding": "0px" } },
                                                    m("div.row.bg-white.radius-5.p-2.article-tags", [
                                                        m("div.col-12.p-0.text-right", [

                                                            m("button.capsul.fz-poppins.text-default.radius-pill.active", {
                                                                title: " Ver Resultado ",
                                                                onclick: () => {
                                                                    Laboratorio.loader = true;
                                                                    Laboratorio.verResultado(_v.urlPdf);

                                                                },
                                                                "style": { "cursor": "pointer" }
                                                            }, [
                                                                m("i.icofont-eye-alt"),
                                                                " Ver "

                                                            ]),
                                                            ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [

                                                            ] : [
                                                                m("button.capsul.fz-poppins.text-default.radius-pill.active", {
                                                                    title: " Imprimir Resultado ",

                                                                    onclick: () => {
                                                                        Laboratorio.loader = true;
                                                                        Laboratorio.imprimirResultado(_v.urlPdf);
                                                                    },
                                                                    "style": { "cursor": "pointer" }
                                                                }, [
                                                                    m("i.icofont-print"),
                                                                    " Imprimir "

                                                                ])
                                                            ]),
                                                            m("a.capsul.fz-poppins.radius-pill.active", {
                                                                title: " Compartir Resultado ",
                                                                href: _v.deep_link,
                                                                target: "_blank",
                                                                style: { "cursor": "pointer", "display": "none" }
                                                            }, [
                                                                m("i.icofont-share"),
                                                                " Compartir "

                                                            ]),
                                                        ]),
                                                        m("div.col-12.p-2", [
                                                            m("div", {
                                                                    "style": {
                                                                        "display": ((_fechaHoy == _v.FECHA_REGISTRADO) ? "block" : "none")
                                                                    }
                                                                },
                                                                m("span", {
                                                                        "style": { "color": "red" }
                                                                    },
                                                                    " Nuevo Resultado "
                                                                )
                                                            ),
                                                            m("span.d-block",
                                                                "Origen: " + _v.ORIGEN + " Médico: " + _v.MEDICO.replaceAll(":", "")
                                                            ),
                                                            m("span.d-block",
                                                                " Fecha y Hora: " + _v.FECHA
                                                            ),
                                                            (_v.examenes.length !== 0 ? [m("span.d-block",
                                                                "Exámenes: " + _v.examenes.toString()
                                                            )] : [])
                                                        ]),

                                                    ])
                                                )
                                            )
                                        ]
                                    })
                                ])
                            ])
                        ),

                    )
                ]),
            ] : []
        }







    }

};

class DetalleResultadoPaciente {
    static data = [];
    static detalle = [];
    static error = "";
    static fetch() {
        DetalleResultadoPaciente.data = [];
        DetalleResultadoPaciente.error = "";
        m.request({
                method: "POST",
                url: "https://api.hospitalmetropolitano.org/t/v1/buscar-paciente",
                body: {
                    tipoBusqueda: "nhc",
                    pte: ResultadoPaciente.nhc
                },
                headers: {
                    "Authorization": localStorage.accessToken,
                },
                extract: function(xhr) {

                    let jsonXHR = JSON.parse(xhr.responseText);

                    if (xhr.status === 500 && jsonXHR.status == false && jsonXHR.errorCode == 0) {
                        alert(jsonXHR.message);
                        window.location.href = "/salir";
                    }

                    return { status: xhr.status, body: JSON.parse(xhr.responseText) }

                }
            })
            .then(function(response) {
                let result = response.body;
                if (result.status) {
                    DetalleResultadoPaciente.data = result.data[0];
                    DetalleResultadoPaciente.data.HC = DetalleResultadoPaciente.data.PK_NHCL;
                    DetalleResultadoPaciente.data.NOMBRE_PACIENTE = DetalleResultadoPaciente.data.APELLIDOS + " " + DetalleResultadoPaciente.data.NOMBRES
                } else {
                    DetalleResultadoPaciente.error = "No existe información disponible. Comuníquese con el Administrador del Sistema.";
                }
            })
            .catch(function(e) {
                setTimeout(function() { DetalleResultadoPaciente.fetch(); }, 5000);
            })
    }
    view() {
        if (DetalleResultadoPaciente.data.length !== 0) {
            return [
                m("div.col-md-4." + DetalleClinico.inZoom,
                    m("div.department-tab-pill.m-pt-140.m-pb-140.position-relative.", [
                        m("i.icofont-prescription.text-white.fz-40", { "style": { "margin-left": "-5px" } }),
                        m("h2.text-white.pb-md-5", [
                            DetalleResultadoPaciente.data.NOMBRE_PACIENTE
                        ]),

                        m("h6.ml12.text-white.text-uppercase.fadeInDown-slide.animated",
                            "NHC: " + DetalleResultadoPaciente.data.HC
                        ),

                        m(".nav.pt-md-0.flex-column.nav-pills[id='v-pills-tab'][role='tablist'][aria-orientation='vertical']", [
                            m("a.nav-link[data-toggle='pill'][role='tab']", {
                                href: '#v-pills-lab',
                                onclick: (e) => {
                                    e.preventDefault();
                                    MenuBoton.update = "LAB";
                                },
                                oncreate: (el) => {
                                    el.dom.click();
                                }
                            }, [
                                m("i.icofont-laboratory"),
                                m("span",
                                    " Laboratorio "
                                )
                            ]),
                            m("a.nav-link[data-toggle='pill'][role='tab']", {
                                href: '#v-pills-imagen',
                                onclick: (e) => {
                                    e.preventDefault();
                                    MenuBoton.update = "RX";
                                }
                            }, [
                                m("i.icofont-file-image"),
                                m("span",
                                    " Imagen "
                                )
                            ]),

                        ])
                    ])
                ),
            ]
        }



    }
}

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
            Laboratorio.fetch();
        }

        if (MenuBoton.update == "RX") {
            Imagen.fetch();
        }


    }
    onupdate(_data) {
        m.redraw();
    }

    view() {

        if (MenuBoton.show.length === 0) {

            if (verDocPDF.numPage == 0) {
                return [
                    m("div.button-menu-right-p1", { "style": { "display": "flex" } },
                        m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    MenuBoton.show = "d-none";
                                    MenuBoton.close = "";
                                    MenuBoton.zoomin = "";
                                    MenuBoton.zoomout = "";
                                    MenuBoton.reload = "";

                                },
                            },
                            m("i.icofont-plus", { "style": { "font-size": "x-large" } })
                        )
                    ),

                ]
            } else if (verDocPDF.numPage == 1) {
                return [
                    m("div.button-menu-right-p1", { "style": { "display": "flex" } },
                        m("div.text-primary.mr-2", "Descargar"),
                        m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();

                                    window.open(verDocPDF.url)


                                },
                            },
                            m("i.icofont-download", { "style": { "font-size": "x-large" } })
                        )
                    ),

                    ((!(window.matchMedia('(min-width: 1320px)').matches)) ? [

                        m("div.button-menu-right-p2", { "style": { "display": "flex" } }, [
                                m("div.text-primary.mr-2", "Cerrar"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                        onclick: (e) => {
                                            e.preventDefault();
                                            verDocPDF.show = "";
                                            verDocPDF.url = "";
                                            verDocPDF.numPage = 0;
                                            verDocPDF.pageNum = 1;
                                            if (verDocPDF.typeDoc == 'LAB') {
                                                verDocPDF.tab = "active show";
                                                verDocPDF.tabImagen = "";
                                            } else {
                                                verDocPDF.tabImagen = "active show";
                                                verDocPDF.tab = "";
                                            }
                                            DetalleClinico.inZoom = "";

                                        },
                                    },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                                )

                            ]

                        )
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
                                m("div.text-primary.mr-2", "Cerrar"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                        onclick: (e) => {
                                            e.preventDefault();
                                            verDocPDF.show = "";
                                            verDocPDF.url = "";
                                            verDocPDF.numPage = 0;
                                            verDocPDF.pageNum = 1;
                                            if (verDocPDF.typeDoc == 'LAB') {
                                                verDocPDF.tab = "active show";
                                                verDocPDF.tabImagen = "";
                                            } else {
                                                verDocPDF.tabImagen = "active show";
                                                verDocPDF.tab = "";
                                            }
                                            DetalleClinico.inZoom = "";


                                        },
                                    },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                                )

                            ]

                        )
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
                                m("div.text-primary.mr-2", "Cerrar"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                        onclick: (e) => {
                                            e.preventDefault();
                                            verDocPDF.show = "";
                                            verDocPDF.url = "";
                                            verDocPDF.numPage = 0;
                                            verDocPDF.pageNum = 1;
                                            if (verDocPDF.typeDoc == 'LAB') {
                                                verDocPDF.tab = "active show";
                                                verDocPDF.tabImagen = "";
                                            } else {
                                                verDocPDF.tabImagen = "active show";
                                                verDocPDF.tab = "";
                                            }
                                            DetalleClinico.inZoom = "";

                                        },
                                    },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                                )

                            ]

                        )
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
                                m("div.text-primary.mr-2", "Cerrar"),
                                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                        onclick: (e) => {
                                            e.preventDefault();
                                            verDocPDF.show = "";
                                            verDocPDF.url = "";
                                            verDocPDF.numPage = 0;
                                            verDocPDF.pageNum = 1;
                                            if (verDocPDF.typeDoc == 'LAB') {
                                                verDocPDF.tab = "active show";
                                                verDocPDF.tabImagen = "";
                                            } else {
                                                verDocPDF.tabImagen = "active show";
                                                verDocPDF.tab = "";
                                            }
                                            DetalleClinico.inZoom = "";


                                        },
                                    },
                                    m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                                )

                            ]

                        )
                    ]),




                ]
            } else {
                return [
                    m("div.button-menu-right-p1", { "style": { "display": "flex" } }, [
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        MenuBoton.show = "";
                                        MenuBoton.close = "d-none";
                                        MenuBoton.zoomin = "d-none";
                                        MenuBoton.zoomout = "d-none";
                                        MenuBoton.reload = "d-none";
                                    },
                                },
                                m("i.icofont-close", { "style": { "font-size": "x-large" } })
                            )

                        ]

                    ),
                    m("div.button-menu-right-p2", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Actualizar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        MenuBoton.show = "";
                                        MenuBoton.close = "d-none";
                                        MenuBoton.zoomin = "d-none";
                                        MenuBoton.zoomout = "d-none";
                                        MenuBoton.reload = "d-none";
                                        verDocPDF.show = "";
                                        verDocPDF.tab = "active show";
                                        MenuBoton.setComand();


                                    },
                                },
                                m("i.icofont-refresh", { "style": { "font-size": "x-large" } })
                            )
                        ]

                    ),
                    m("div.button-menu-right-p3", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Aumentar"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        DetalleClinico.inZoom = "d-none";
                                        MenuBoton.show = "";
                                        MenuBoton.close = "d-none";
                                        MenuBoton.zoomin = "d-none";
                                        MenuBoton.zoomout = "d-none";
                                        MenuBoton.reload = "d-none";
                                    },
                                },
                                m("i.icofont-ui-zoom-in", { "style": { "font-size": "x-large" } })
                            )
                        ]

                    ),
                    m("div.button-menu-right-p4", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Disminuir"),
                            m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                    onclick: (e) => {
                                        e.preventDefault();
                                        DetalleClinico.inZoom = "";
                                        MenuBoton.show = "";
                                        MenuBoton.close = "d-none";
                                        MenuBoton.zoomin = "d-none";
                                        MenuBoton.zoomout = "d-none";
                                        MenuBoton.reload = "d-none";
                                    },
                                },
                                m("i.icofont-ui-zoom-out", { "style": { "font-size": "x-large" } })
                            )

                        ]

                    )

                ]
            }

        } else {
            return [
                m("div.button-menu-right-p1", { "style": { "display": "flex" } }, [
                        m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    MenuBoton.show = "";
                                    MenuBoton.close = "d-none";
                                    MenuBoton.zoomin = "d-none";
                                    MenuBoton.zoomout = "d-none";
                                    MenuBoton.reload = "d-none";
                                },
                            },
                            m("i.icofont-close", { "style": { "font-size": "x-large" } })
                        )

                    ]

                ),
                m("div.button-menu-right-p2", { "style": { "display": "flex" } }, [
                        m("div.text-primary.mr-2", "Actualizar"),
                        m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    MenuBoton.show = "";
                                    MenuBoton.close = "d-none";
                                    MenuBoton.zoomin = "d-none";
                                    MenuBoton.zoomout = "d-none";
                                    MenuBoton.reload = "d-none";
                                    verDocPDF.show = "";
                                    verDocPDF.tab = "active show";

                                    MenuBoton.setComand();


                                },
                            },
                            m("i.icofont-refresh", { "style": { "font-size": "x-large" } })
                        )
                    ]

                ),
                m("div.button-menu-right-p3", { "style": { "display": "flex" } }, [
                        m("div.text-primary.mr-2", "Aumentar"),
                        m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    DetalleClinico.inZoom = "d-none";
                                    MenuBoton.show = "";
                                    MenuBoton.close = "d-none";
                                    MenuBoton.zoomin = "d-none";
                                    MenuBoton.zoomout = "d-none";
                                    MenuBoton.reload = "d-none";
                                },
                            },
                            m("i.icofont-ui-zoom-in", { "style": { "font-size": "x-large" } })
                        )
                    ]

                ),
                m("div.button-menu-right-p4", { "style": { "display": "flex" } }, [
                        m("div.text-primary.mr-2", "Disminuir"),
                        m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    e.preventDefault();
                                    DetalleClinico.inZoom = "";
                                    MenuBoton.show = "";
                                    MenuBoton.close = "d-none";
                                    MenuBoton.zoomin = "d-none";
                                    MenuBoton.zoomout = "d-none";
                                    MenuBoton.reload = "d-none";
                                },
                            },
                            m("i.icofont-ui-zoom-out", { "style": { "font-size": "x-large" } })
                        )

                    ]

                )

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
    oncreate() {
        MenuBoton.update = "LAB";
        DetalleResultadoPaciente.fetch();
    }
    view() {
        return DetalleResultadoPaciente.error ? [
            m("div.container",
                m("div.m-pt-50.text-center", [
                    m(".alert.alert-danger[role='alert']", [
                            DetalleResultadoPaciente.error,
                            " Regresar a Resultados",
                            m("a", {
                                href: "/resultados"
                            }, " Click Aquí"),

                        ]

                    )
                ])
            )
        ] : DetalleResultadoPaciente.data.length !== 0 ? [
            m("section.m-bg-1.intro-area.type-1.position-relative", [
                m("div.intro-overlay.position-absolute.set-bg." + DetalleClinico.inZoom, {
                    "style": {
                        "background-position": "center center",
                        "background-size": "cover",
                        "background-repeat": "no-repeat",
                        "background-image": 'url(\"/assets/images/intro-bg.jpg\")',
                    }
                }),
                m("div.overlay." + DetalleClinico.inZoom),
                m("div.container", {
                        class: (DetalleClinico.inZoom.length === 0) ? "" : "bg-white",
                        style: {
                            "height": "2500px"
                        }
                    },
                    m("div.row", [
                        m(DetalleResultadoPaciente),
                        m("div", {
                            class: (DetalleClinico.inZoom.length !== 0) ? "col-md-12" : "col-md-8"
                        }, [
                            m("div.tab-content.m-pb-140.", {
                                class: (DetalleClinico.inZoom.length === 0) ? "m-pt-130" : "m-pt-40"
                            }, [
                                m(Laboratorio),
                                m(Imagen),
                                m(verDocPDF)
                            ])
                        ])
                    ]),

                ),
                m(MenuBoton)
            ])
        ] : m(Loader, { loaderPage: true })
    }
}


class ResultadoPaciente extends App {
    static nhc = null;
    constructor() {
        super();
    }
    oninit(_data) {
        ResultadoPaciente.nhc = _data.attrs.nhc;
        DetalleResultadoPaciente.data = [];
        Laboratorio.data = [];
        Imagen.data = [];

    }
    oncreate() {
        this.mainLayout();
        this._setTitle = "Detalle del Paciente";
    }
    view() {

        return [
            m("div." + ((VisorRis.show.length === 0) ? "" : "d-none"), [
                (DetalleClinico.inZoom.length === 0) ? m(HeaderPrivate) : "",
                m(DetalleClinico)
            ]),
            m("div." + ((VisorRis.show.length === 0) ? "d-none" : ""), [
                m(VisorRis)
            ])
        ];

    }

};




export default ResultadoPaciente;