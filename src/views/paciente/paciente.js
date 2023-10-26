import HeaderPublic from '../layout/header-public';
import App from '../app';
import m from 'mithril';
import Loader from '../loader';


class verDocPDF {
    static url = "";
    static show = "";
    static numPage = 0;
    static tab = "";
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

    static loadBASE64(pdfData) {

        DetalleClinico.inZoom = "d-none";
        verDocPDF.url = "base64";
        verDocPDF.show = "d-none";

        setTimeout(function () {

            $(".doc-loader").show();
            $(".doc-content").hide();
            $(".doc-control").hide();
            var pdfjsLib = window["pdfjs-dist/build/pdf"];
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                "assets/dashforge/lib/pdf.js/build/pdf.worker.js";
            verDocPDF.canvas = document.getElementById("render-pdf");
            verDocPDF.ctx = verDocPDF.canvas.getContext("2d");

            pdfjsLib
                .getDocument({ data: pdfData })
                .promise.then(function (pdfDoc_) {
                    verDocPDF.pdfDoc = pdfDoc_;
                    $(".page_count").text(verDocPDF.pdfDoc.numPages);
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

    static loadDocument(_url) {

        DetalleClinico.inZoom = "d-none";
        verDocPDF.url = _url;
        verDocPDF.show = "d-none";

        setTimeout(function () {

            $(".doc-loader").show();
            $(".doc-content").hide();
            $(".doc-control").hide();

            var pdfjsLib = window["pdfjs-dist/build/pdf"];
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
                                    m("span.icon-section-wave.d-inline-block.text-active.mt-3.",),
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

                ])

            ]
        }


    }




}

class VisorRis {
    static show = "";
    static url = "";
    view() {


        document.cookie = "cookieName=; Path=/; domain=https://imagen.hmetro.med.ec; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        VisorRis.url = "https://imagen.hmetro.med.ec/zfp?Lights=on&mode=proxy#view&pid=" + Paciente.nhc + "&un=WEBAPI&pw=lEcfvZxzlXTsfimMMonmVZZ15IqsgEcdV%2forI8EUrLY%3d";

        return [

            m("div", [

                m(".row",
                    m("div.w-100.position-relative.set-bg.breadcrumb-container", { "style": { "background-position": "center center", "background-size": "cover", "background-repeat": "no-repeat" } }, [
                        m("div.overlay.op-P9"),
                        m("div.container",
                            m("div.row",
                                m("div.col-md-12",)
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
            .then(function (result) {
                Imagen.loader = false;
                if (result.status !== undefined && result.status) {
                    verDocPDF.tabImagen = "active show";
                    verDocPDF.tab = "";
                    verDocPDF.typeDoc = 'RX';
                    verDocPDF.loadDocument(result.url);
                } else {
                    Imagen.error = "Resultado no disponible. Ingrese a 'Ver Exámenes' para más información.";
                    setTimeout(function () { Imagen.error = ""; }, 5000);
                }

            })
            .catch(function (e) {
                alert("Resultado no disponible.");
                Imagen.loader = false;
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
            .then(function (result) {
                Imagen.loader = false;

                if (result.status !== undefined && result.status) {
                    printJS({
                        printable: result.url,
                        type: 'pdf',

                    })
                } else {
                    Imagen.error = "Resultado no disponible.";
                    setTimeout(function () { Imagen.error = ""; }, 5000);
                }


            }).catch(function (e) {
                alert("Resultado no disponible.");
                Imagen.loader = false;
                Imagen.error = "";
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
            url: "https://api.hospitalmetropolitano.org/v2/pacientes/resultados-img/" + Paciente.nhc,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                Imagen.loader = false;

                if (result.status && result.data.length !== 0) {
                    Imagen.data = result.data;
                } else {
                    Imagen.error = result.message;
                }
            })
            .catch(function (e) {
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
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3.",)
                    )
                ])
            ]);
        } else {
            return Imagen.error ? [
                m(".tab-pane.mt-5.fade[id='v-pills-imagen'][role='tabpanel']", [
                    m("h4.m-text-2.",
                        m("i.icofont-file-image.mr-2"),
                        "Resultados de Imagen:"
                    ),
                    m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                        "Hospital Metropolitano"
                    ),
                    m(".alert.alert-danger[role='alert']",
                        Imagen.error
                    )
                ]),
            ] : (Imagen.data.length !== 0) ? [
                m(".tab-pane.fade." + verDocPDF.tabImagen + "[id='v-pills-imagen'][role='tabpanel']", {
                    class: (verDocPDF.show.length == 0) ? "mt-0" : "mt-0",
                }, [
                    [(verDocPDF.show.length == 0) ? [
                        m("h4.m-text-2.",
                            m("i.icofont-file-image.mr-2"),
                            "Resultados de Imagen:"
                        ),
                        m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                            "Hospital Metropolitano"
                        ),


                    ] : [

                        (verDocPDF.url !== 'base64' ? [m("div.row", [
                            m("div.text-center.w-100", [
                                m("img.m-1.d-inline[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='200rem']"),
                                m("p.m-text-2.p-0.m-0",
                                    m("i.icofont-image.mr-2"), "Visor de Resultados:"

                                ),
                            ])
                        ])] : [])


                    ]],

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
                        )
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
                                    Imagen.data.map(function (_v, _i, _contentData) {

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

                ]),
            ] : []
        }



    }

};


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
            .then(function (result) {
                Laboratorio.loader = false;
                if (result.status !== undefined && result.status) {
                    verDocPDF.tab = "active show";
                    verDocPDF.tabImagen = "";
                    verDocPDF.typeDoc = 'LAB';
                    verDocPDF.loadDocument(result.url);

                } else {
                    Laboratorio.error = "Resultado no disponible.";
                    setTimeout(function () { Laboratorio.error = ""; }, 5000);
                }

            })
            .catch(function (e) {
                alert("Resultado no disponible.");
                Laboratorio.loader = false;
                verDocPDF.show = "";
                Laboratorio.error = "";
            });

    }
    static fetchResultado(url) {
        Laboratorio.loader = false;
        m.request({
            method: "GET",
            url: url,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                Laboratorio.loader = false;
                if (result.status !== undefined && result.status) {
                    window.open(result.url);
                } else {
                    Laboratorio.error = "Resultado no disponible.";
                    setTimeout(function () { Laboratorio.error = ""; }, 5000);
                }

            }).catch(function (e) {
                alert("Resultado no disponible.");
                Laboratorio.loader = false;
                verDocPDF.show = "";
                Laboratorio.error = "";
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
            .then(function (result) {
                Laboratorio.loader = false;
                if (result.status !== undefined && result.status) {
                    printJS(result.url)
                } else {
                    Laboratorio.error = "Resultado no disponible.";
                    setTimeout(function () { Laboratorio.error = ""; }, 5000);
                }

            }).catch(function (e) {
                alert("Resultado no disponible.");
                Laboratorio.loader = false;
                verDocPDF.show = "";
                Laboratorio.error = "";
            });

    }
    static fetch() {
        Laboratorio.data = [];
        Laboratorio.error = "";
        Laboratorio.loader = true;

        m.request({
            method: "GET",
            url: "https://api.hospitalmetropolitano.org/v2/pacientes/resultados-laboratorio/" + Paciente.nhc,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                Laboratorio.loader = false;

                if (result.status && result.data.length !== 0) {
                    Laboratorio.data = result.data;
                } else {
                    Laboratorio.error = result.message;
                }

            })
            .catch(function (e) {
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
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3.",)
                    )
                ])
            ]);
        } else {
            return Laboratorio.error ? [
                m(".tab-pane.mt-5.fade[id='v-pills-lab'][role='tabpanel']", [
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
                m(".tab-pane.fade." + verDocPDF.tab + "[id='v-pills-lab'][role='tabpanel']", {
                    class: (verDocPDF.show.length == 0) ? "mt-0" : "",

                }, [
                    [(verDocPDF.show.length == 0) ? [
                        m("h4.m-text-2",
                            m("i.icofont-laboratory.mr-2"), "Resultados de Laboratorio:"

                        ),
                        m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                            "Hospital Metropolitano"
                        ),
                    ] : [

                        (verDocPDF.url !== 'base64' ? [m("div.row", [
                            m("div.text-center.w-100", [
                                m("img.m-1.d-inline[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='200rem']"),
                                m("p.m-text-2.p-0.m-0",
                                    m("i.icofont-laboratory.mr-2"), "Visor de Resultados:"
                                ),
                            ])
                        ])] : [])



                    ]],

                    m("h6.mb-5." + verDocPDF.show, [
                        "Resultados disponibles desde Enero, 2019.",


                    ]),

                    m("div.row.p-1",
                        m("div.table-content.col-12.pd-r-0.pd-l-0.pd-b-20.w-100." + verDocPDF.show,
                            m("table.table.table-sm", { "style": { "width": "100%", "border-color": "transparent", "margin-bottom": "50px" } }, [
                                m("tbody", [
                                    Laboratorio.data.map(function (_v, _i, _contentData) {


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

class FOR005 {
    static secs = [];
    static nombres = "";
    static parseDoc(_data) {

        return Object.keys(_data.data).map(function (_v, _i, _contentData) {
            FOR005.secs.push(_data.data[_v])
        })

    }
    oncreate() {
        FOR005.secs = [];
        return Formulario.data.map(function (_v, _i, _contentData) {
            FOR005.parseDoc(Formulario.data[_i])
        })



    }
    static viewLista() {

        let evolucion_medica_texto = "";
        let prescripciones_texto = "";


        if (FOR005.secs.length !== 0) {
            return FOR005.secs.map(function (_v, _i, _contentData) {



                if (_v.name == 'nombres') {



                    FOR005.nombres = _v.answer;

                }


                if (_v.name == 'apellidos_paciente') {



                    FOR005.apellidos_paciente = _v.answer;

                }

                if (_v.name == 'sexo de paciente') {

                    FOR005.sexo = _v.answer;

                }

                if (_v.name == 'nhcl') {

                    FOR005.nhcl = _v.answer;


                }

                if (_v.name == 'numero_admision') {

                    FOR005.numero_admision = _v.answer;

                }

                if (_v.name == 'edad') {

                    FOR005.edad = _v.answer;

                }

                if (_v.name == 'edad_paciente') {

                    FOR005.edad_paciente = _v.answer;

                }

                if (_v.name == 'identificacion_paciente') {

                    FOR005.identificacion = _v.answer;

                }

                if (_v.name == 'fecha_admision') {

                    FOR005.fecha_admision = _v.answer;

                }

                if (_v.name == 'ubicacion_atencion') {

                    FOR005.ubicacion = _v.answer;

                }


                if (_v.name == 'fecha_alta') {

                    FOR005.fecha_alta = (_v.answer == null) ? '' : _v.answer;

                }

                if (_v.name == 'medico_tratante') {

                    FOR005.medico_tratante = _v.answer;

                }

                if (_v.name == 'prescripciones_texto') {

                    prescripciones_texto = _v.answer;

                }

                if (_v.name == 'evolucion_medica_texto') {

                    evolucion_medica_texto = _v.answer;

                }

                if (_v.name == 'Logotipo_archivo') {


                    return m("table.table.table-bordered.table-responsive.mb-60.mt-4.p-2", {

                    }, [
                        m("thead", [
                            m("tr",
                                m("th[colspan='12'][scope='col']", [
                                    m("i.tx-light.fas.fa-file-alt.mg-r-2."),
                                    m("div.p-0", " SNS - MSP / HCU-form.005 / 2008 "),


                                ])
                            ),
                            m("tr", [
                                m("th[colspan='10'][scope='col']",
                                    m("div.m-0.p-0",
                                        m("img", {
                                            width: "100rem",
                                            src: "data:image/png;base64," + _v.answer
                                        })
                                    )
                                ),
                                m("th[colspan='2'][scope='col']",
                                    m("div.m-0.p-0",
                                        "HIS MV"

                                    )
                                )

                            ])
                        ]),
                        m("tbody", [
                            m("tr", [
                                m("th[colspan='3'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.tx-bold.text-center.",
                                        "ESTABLECIMIENTO"
                                    )
                                ),
                                m("th[colspan='3'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.tx-bold.text-center.",
                                        "NOMBRE"
                                    )
                                ),
                                m("th[colspan='3'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.tx-bold.text-center.",
                                        "APELLIDO"
                                    )
                                ),
                                m("th[colspan='1'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.tx-bold.text-center.",
                                        "SEXO (M-F)"
                                    )
                                ),
                                m("th[colspan='1][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.tx-bold.text-center.",
                                        "NHCL."
                                    )
                                ),
                                m("th[colspan='1'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.tx-bold.text-center.",
                                        "ADM."
                                    )
                                )
                            ]),
                            m("tr", [
                                m("th.text-center[colspan='3'][scope='row']",
                                    m("div.m-0.p-0.text-center",
                                        "HOSPITAL METROPOLITANO"
                                    )
                                ),
                                m("td.text-center[colspan='3']",
                                    m("div.m-0.p-0.text-center",
                                        FOR005.nombres
                                    )
                                ),
                                m("td.text-center[colspan='3']",
                                    m("div.m-0.p-0.text-center",
                                        FOR005.apellidos_paciente
                                    )
                                ),
                                m("td.text-center[colspan='1']",
                                    m("div.m-0.p-0.text-center",
                                        FOR005.sexo
                                    )
                                ),
                                m("td.text-center[colspan='1']",
                                    m("div.m-0.p-0.text-center",
                                        FOR005.nhcl
                                    )
                                ),
                                m("td.text-center[colspan='1']",
                                    m("div.m-0.p-0.text-center",
                                        FOR005.numero_admision
                                    )
                                )
                            ]),
                            m("tr", [
                                m("th[colspan='1'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.m-0.p-0.tx-bold.text-center.",
                                        "EDAD"
                                    )
                                ),
                                m("th[colspan='1'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.m-0.p-0.tx-bold.text-center.",
                                        "IDENTIFICACION"
                                    )
                                ),
                                m("th[colspan='1'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.m-0.p-0.tx-bold.text-center.",
                                        "FECHA ADMISION"
                                    )
                                ),
                                m("th[colspan='1'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.m-0.p-0.tx-bold.text-center.",
                                        "FECHA ALTA"
                                    )
                                ),
                                m("th[colspan='4'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.m-0.p-0.tx-bold.text-center.",
                                        "UBICACION"
                                    )
                                ),
                                m("th[colspan='4'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.m-0.p-0.tx-bold.text-center.",
                                        "MEDICO TRATANTE"
                                    )
                                )
                            ]),
                            m("tr", [
                                m("td.text-center[colspan='1'][scope='row']",
                                    m("div.m-0.p-0.text-center",
                                        FOR005.edad || FOR005.edad_paciente
                                    )
                                ),
                                m("td.text-center[colspan='1']",
                                    m("div.m-0.p-0.text-center",
                                        FOR005.identificacion
                                    )
                                ),
                                m("td.text-center[colspan='1']",
                                    m("div.m-0.p-0.text-center",
                                        FOR005.fecha_admision
                                    )
                                ),
                                m("td.text-center[colspan='1']",
                                    m("div.m-0.p-0.text-center",
                                        FOR005.fecha_admision
                                    )
                                ),
                                m("td.text-center[colspan='4']",
                                    m("div.m-0.p-0.text-center",
                                        FOR005.ubicacion
                                    )
                                ),
                                m("td.text-center[colspan='4']",
                                    m("div.m-0.p-0.text-center",
                                        FOR005.medico_tratante
                                    )
                                )
                            ]),
                            m("tr", [
                                m("th[colspan='6'][scope='row']", { "style": { "padding": "0", "background-color": "#eef9c8" } },
                                    m("div.m-0.p-0.tx-bold.text-center.",
                                        "1.- EVOLUCIÓN"
                                    )
                                ),
                                m("th[colspan='5'][scope='row']", { "style": { "padding": "0", "background-color": "#eef9c8" } },
                                    m("div.m-0.p-0.tx-bold.text-center.",
                                        "2.- PRESCRIPCIONES"
                                    )
                                ),
                                m("th[colspan='1'][scope='row']", { "style": { "padding": "0", "background-color": "#eef9c8" } },
                                    m("div.m-0.p-0.tx-bold.text-center.", [
                                        "FIRMAR AL PIE DE",
                                        m("br"),
                                        "CADA PRESCRIPCIÓN"
                                    ]

                                    )
                                ),

                            ]),
                            m("tr", [
                                m("th[colspan='1'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.m-0.p-0.tx-bold.text-center.", [
                                        "FECHA",
                                        m("br"),
                                        "día/mes/año"
                                    ])
                                ),
                                m("th[colspan='1'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.m-0.p-0.tx-bold.text-center.",
                                        "HORA"
                                    )
                                ),
                                m("th[colspan='4'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.m-0.p-0.tx-bold.text-center.",
                                        "NOTAS DE EVOLUCIÓN"
                                    )
                                ),
                                m("th[colspan='4'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.m-0.p-0.tx-bold.text-center.", [
                                        "FARMACOTERAPIA E INDICACIONES",
                                        m("br"),
                                        "(PARA ENFERMERÍA Y OTRO PERSONAL)"

                                    ]

                                    )
                                ),
                                m("th[colspan='2'][scope='row']", { "style": { "padding": "0", "background-color": "#edfbf5" } },
                                    m("div.m-0.p-0.tx-bold.text-center.", [
                                        "ADMINISTR.",
                                        m("br"),
                                        "FÁRMACOS INSUMOS"

                                    ]

                                    )
                                ),

                            ]),
                            m("tr", [
                                m("td[colspan='6'][scope='row']", { "style": { "padding": "0", "width": "50%" } },
                                    m("div.m-0.p-2.tx-bold.text-justify",
                                        (evolucion_medica_texto !== null && evolucion_medica_texto.length !== 0) ? m.trust(evolucion_medica_texto.replace(/(\r\n|\r|\n)/g, "<br/>")) : ""


                                    )
                                ),
                                m("td[colspan='6'][scope='row']", { "style": { "padding": "0", "width": "50%" } },
                                    m("div.m-0.p-2.text-justify",
                                        (prescripciones_texto !== null && prescripciones_texto.length !== 0) ? m.trust(prescripciones_texto.replace(/(\r\n|\r|\n)/g, "<br/>")) : ""

                                    )
                                ),

                            ]),

                        ])
                    ])

                }


            })
        }



    }
    static viewFormulario() {


        let evolucion_medica_texto = "";
        let prescripciones_texto = "";


        if (FOR005.secs.length !== 0) {
            return FOR005.secs.map(function (_v, _i, _contentData) {


                if (_v.name == 'nombres') {



                    FOR005.nombres = _v.answer;

                }


                if (_v.name == 'apellidos_paciente') {



                    FOR005.apellidos_paciente = _v.answer;

                }

                if (_v.name == 'sexo de paciente') {

                    FOR005.sexo = _v.answer;

                }

                if (_v.name == 'nhcl') {

                    FOR005.nhcl = _v.answer;

                }

                if (_v.name == 'numero_admision') {

                    FOR005.numero_admision = _v.answer;

                }

                if (_v.name == 'edad') {

                    FOR005.edad = _v.answer;

                }

                if (_v.name == 'edad_paciente') {

                    FOR005.edad_paciente = _v.answer;

                }

                if (_v.name == 'identificacion_paciente') {

                    FOR005.identificacion = _v.answer;

                }

                if (_v.name == 'fecha_admision') {

                    FOR005.fecha_admision = _v.answer;

                }

                if (_v.name == 'ubicacion_atencion') {

                    FOR005.ubicacion = _v.answer;

                }


                if (_v.name == 'fecha_alta') {

                    FOR005.fecha_alta = (_v.answer == null) ? '' : _v.answer;

                }

                if (_v.name == 'medico_tratante') {

                    FOR005.medico_tratante = _v.answer;

                }

                if (_v.name == 'prescripciones_texto') {

                    prescripciones_texto = _v.answer;

                }

                if (_v.name == 'evolucion_medica_texto') {

                    evolucion_medica_texto = _v.answer;

                }

                if (_v.name == 'Logotipo_archivo') {


                    return m("table.table.table-bordered.mb-60.mt-4.p-2.w-100", {

                    }, [
                        m("tbody", [
                            m("tr",
                                m("th[colspan='12'][scope='col']", [
                                    m("i.tx-light.fas.fa-file-alt.mg-r-2."),
                                    m("div.d-inline.p-0", " DOCUMENTO CONFIDENCIAL "),


                                ])
                            ),
                            m("tr", [
                                m("th[colspan='10'][scope='col']",
                                    m("div.m-0.p-0",
                                        m("img", {
                                            width: "100rem",
                                            src: "data:image/png;base64," + _v.answer
                                        })
                                    )
                                ),
                                m("th[scope='col']", {
                                    class: "text-right",
                                    "style": { "background-color": "#edfbf5" }
                                },
                                    "VER FOR 005"
                                )

                            ])
                        ]),

                    ])
                }


            })
        }






    }
    view() {
        return FOR005.viewLista();
    }

};

class Formulario {
    static zoo = 0.5;
    static adm = 1;
    static nhc = 1;
    static data = [];
    static error = "";
    static fetch() {
        Formulario.data = [];
        Formulario.error = "";
        m.request({
            method: "GET",
            url: "https://api.hospitalmetropolitano.org/v2/medicos/formulario?nhcl=" + Formulario.nhc + "&adm=" + Formulario.adm,

            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                if (result.length !== 0) {
                    Formulario.data = result;
                } else {
                    Formulario.error = "El documento solicitado no esta disponible.";
                }

            })
            .catch(function (e) {
                setTimeout(function () { Formulario.fetch(); }, 5000);

            })
    }

    view() {

        return Formulario.error ? [
            m(".alert.alert-danger[role='alert']",
                Formulario.error
            ),
        ] : Formulario.data.length !== 0 ? [

            m(FOR005)

        ] : [
            m("div.wd-100p.text-center", [
                m("div.loader-content",
                    m("span.icon-section-wave.d-inline-block.text-active.mt-10.mb-10.",)
                )
            ])
        ]

    }
}

class Evoluciones {
    static data = [];
    static detalle = [];
    static error = "";
    static showFor = "";
    static loader = true;
    static fetch() {
        Evoluciones.data = [];
        Evoluciones.error = "";
        Evoluciones.loader = true;
        m.request({
            method: "POST",
            url: "https://api.hospitalmetropolitano.org/t/v1/ev-paciente-emergencia",
            body: {
                numeroHistoriaClinica: Paciente.nhc
            },
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                Evoluciones.loader = false;
                if (result.status) {
                    Evoluciones.data = result.data;
                    Formulario.adm = Evoluciones.data[0].ADM;
                    Formulario.nhc = Evoluciones.data[0].NHCL;
                    Formulario.fetch();
                } else {
                    Evoluciones.error = result.message;
                }
            })
            .catch(function (e) {
                setTimeout(function () { Evoluciones.fetch(); }, 5000);

            })
    }

    view() {


        return Evoluciones.error ? [
            m(".tab-pane.fade[id='v-pills-ev'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-prescription.mr-2"),

                    "Evoluciones y Prescripciones:"
                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m(".alert.alert-danger[role='alert']",
                    Evoluciones.error
                )
            ]),
        ] : Evoluciones.data.length !== 0 ? [
            m(".tab-pane.fade[id='v-pills-ev'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-prescription.mr-2"),

                    "Evoluciones y Prescripciones:"
                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m("h6.mb-5.d-flex", [
                    "Última información disponible. HIS MV.",
                ]),
                m("div.p-1",
                    m("div.row.bg-white.pd-r-0.pd-l-0.pd-b-20.wd-100p",
                        m(Formulario),
                    ),

                )
            ]),
        ] : [
            m(".tab-pane.fade[id='v-pills-ev'][role='tabpanel']", [
                m("h4.m-text-2.",
                    m("i.icofont-prescription.mr-2"),

                    "Evoluciones y Prescripciones:"
                ),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m("div.wd-100p.text-center", [
                    m("div.loader-content",
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3.",)
                    )
                ])
            ]),
        ]


    }
}

class WidgetsSV {
    static isData = 0;
    static data = {
        PAS: [],
        PAD: [],
        FC: [],
        FR: [],
        SO: [],
        SO: [],
        FIO: [],
        TEMP: [],
        PS: [],
        TA: [],
        CAP: [],
        GLI: [],
    }

    oncreate() {
        WidgetsSV.isData = 0;
        SignosVitales.data.map(function (_v, _i, _contentData) {

            if (_v.SIGNO == 'GLICEMIA CAPILAR') {

                WidgetsSV.isData = 1;

                WidgetsSV.data.GLI = _v;

            }

            if (_v.SIGNO == 'LLENADO CAPILAR') {

                WidgetsSV.isData = 1;

                WidgetsSV.data.CAP = _v;

            }

            if (_v.SIGNO == 'PRESION ARTERIAL SISTOLICA') {

                WidgetsSV.isData = 1;

                WidgetsSV.data.PAS = _v;

            }

            if (_v.SIGNO == 'PRESION ARTERIAL DIASTOLICA') {

                WidgetsSV.isData = 1;


                WidgetsSV.data.PAD = _v;

            }

            if (_v.SIGNO == 'FRECUENCIA CARDIACA') {

                WidgetsSV.isData = 1;


                WidgetsSV.data.FC = _v;

            }

            if (_v.SIGNO == 'FRECUENCIA RESPIRATORIA') {

                WidgetsSV.isData = 1;


                WidgetsSV.data.FR = _v;

            }

            if (_v.SIGNO == 'SATURACION OXIGENO') {

                WidgetsSV.isData = 1;


                WidgetsSV.data.SO = _v;

            }

            if (_v.SIGNO == 'FI02') {

                WidgetsSV.isData = 1;


                WidgetsSV.data.FIO = _v;

            }

            if (_v.SIGNO == 'TEMPERATURA') {

                WidgetsSV.isData = 1;


                WidgetsSV.data.TEMP = _v;

            }

            if (_v.SIGNO == 'PESO') {

                WidgetsSV.isData = 1;


                WidgetsSV.data.PS = _v;

            }

            if (_v.SIGNO == 'TALLA') {

                WidgetsSV.isData = 1;


                WidgetsSV.data.TA = _v;

            }


        })

    }
    view() {

        if (SignosVitales.data.length !== 0) {

            if (Object.keys(WidgetsSV.data).length !== 0) {
                return [
                    Object.keys(WidgetsSV.data).map(function (_v, _i, _contentData) {

                        if ((_v == 'PAS' || _v == 'PAD') && WidgetsSV.data[_v].length !== 0) {
                            return m("div.col-sm-10.offset-sm-1.col-md-12.offset-md-0.col-xl-6",
                                m("div.single-service.bg-white.type-3.radius-10.position-relative.service-wrapper.s-dp-1-3.h-dp-10-60.m-mb-50",
                                    m("div.media", [
                                        m("div.service-circle.position-relative.mb-4.text-active.bg-white.rounded-circle.d-flex.align-items-center.justify-content-center.s-dp-1-3",
                                            m("span.icon-heart-beat.text-grad-1")
                                        ),
                                        m("div.media-body", [
                                            m("h4.text-dark2.mb-3.position-relative.pt-2",
                                                WidgetsSV.data[_v].SIGNO
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].VALOR + "mmHg."
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].FECHA
                                            ),
                                            (Formulario.adm !== 1 ? [
                                                m("p.mb-4.text-white.fz-poppins.text-Underline.d-inline.pr-1.pl-1", {
                                                    style: { "cursor": "pointer", "background-color": "#ea7600" },
                                                    onclick: () => {
                                                        SignosVitales.nameReporte = "Curva de Presión Sistólica / Diastólica";
                                                        SignosVitales.verReporte("http://172.16.253.18/report-executor/mvreport?name=USR_CURVA_PRESION_SP&cdMultiEmpresa=1&cdAtendimento=" + Formulario.adm);
                                                    }
                                                },
                                                    m("span.icofont-patient-file"),

                                                    "Ver Curva de Presión Sistólica / Diastólica "
                                                )
                                            ] : [])
                                        ])
                                    ])
                                )
                            )
                        }

                        if (_v == 'CAP' && WidgetsSV.data[_v].length !== 0) {
                            return m("div.col-sm-10.offset-sm-1.col-md-12.offset-md-0.col-xl-6",
                                m("div.single-service.bg-white.type-3.radius-10.position-relative.service-wrapper.s-dp-1-3.h-dp-10-60.m-mb-50",
                                    m("div.media", [
                                        m("div.service-circle.position-relative.mb-4.text-default.rounded-circle.s-dp-1-3-15.d-flex.align-items-center.justify-content-center.s-dp-1-3",
                                            m("span.icon-test-tube.text-grad-1")
                                        ),
                                        m("div.media-body", [
                                            m("h4.text-dark2.mb-3.position-relative.pt-2",
                                                WidgetsSV.data[_v].SIGNO
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].VALOR + " Seg."
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].FECHA
                                            )

                                        ])
                                    ])
                                )
                            )
                        }

                        if (_v == 'GLI' && WidgetsSV.data[_v].length !== 0) {
                            return m("div.col-sm-10.offset-sm-1.col-md-12.offset-md-0.col-xl-6",
                                m("div.single-service.bg-white.type-3.radius-10.position-relative.service-wrapper.s-dp-1-3.h-dp-10-60.m-mb-50",
                                    m("div.media", [
                                        m("div.service-circle.position-relative.mb-4.text-default.rounded-circle.s-dp-1-3-15.d-flex.align-items-center.justify-content-center.s-dp-1-3",
                                            m("span.icon-test-tube.text-grad-1")
                                        ),
                                        m("div.media-body", [
                                            m("h4.text-dark2.mb-3.position-relative.pt-2",
                                                WidgetsSV.data[_v].SIGNO
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].VALOR + " Seg."
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].FECHA
                                            ),
                                            (Formulario.adm !== 1 ? [
                                                m("p.mb-4.text-white.fz-poppins.text-Underline.d-inline.pr-1.pl-1", {
                                                    style: { "cursor": "pointer", "background-color": "#ea7600" },
                                                    onclick: () => {
                                                        SignosVitales.nameReporte = "Control de Hemoglucotest";
                                                        SignosVitales.verReporteGlicemia({ idReport: 'GLUC', numAtencion: Formulario.adm });
                                                    }
                                                },
                                                    m("span.icofont-patient-file"),

                                                    "Ver control de Hemoglucotest"
                                                )
                                            ] : [])
                                        ])
                                    ])
                                )
                            )
                        }


                        if (_v == 'FC' && WidgetsSV.data[_v].length !== 0) {
                            return m("div.col-sm-10.offset-sm-1.col-md-12.offset-md-0.col-xl-6",
                                m("div.single-service.bg-white.type-3.radius-10.position-relative.service-wrapper.s-dp-1-3.h-dp-10-60.m-mb-50",
                                    m("div.media", [
                                        m("div.service-circle.position-relative.mb-4.text-default.rounded-circle.s-dp-1-3-15.d-flex.align-items-center.justify-content-center.s-dp-1-3",
                                            m("span.icon-heart-beat.text-grad-1")
                                        ),
                                        m("div.media-body", [
                                            m("h4.text-dark2.mb-3.position-relative.pt-2",
                                                WidgetsSV.data[_v].SIGNO
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].VALOR + " LPM"
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].FECHA
                                            ),
                                            (Formulario.adm !== 1 ? [
                                                m("p.mb-4.text-white.fz-poppins.text-Underline.d-inline.pr-1.pl-1", {
                                                    style: { "cursor": "pointer", "background-color": "#ea7600" },
                                                    onclick: () => {
                                                        SignosVitales.nameReporte = "Curva de Frecuencia Cardíaca";
                                                        SignosVitales.verReporte("http://172.16.253.18/report-executor/mvreport?name=USR_CURVA_FREQCARDIACA_SP&cdMultiEmpresa=1&cdAtendimento=" + Formulario.adm);
                                                    }
                                                },
                                                    m("span.icofont-patient-file"),

                                                    "Ver Curva de Frecuencia Cardíaca"
                                                )
                                            ] : [])
                                        ])
                                    ])
                                )
                            )
                        }

                        if (_v == 'FR' && WidgetsSV.data[_v].length !== 0) {
                            return m("div.col-sm-10.offset-sm-1.col-md-12.offset-md-0.col-xl-6",
                                m("div.single-service.bg-white.type-3.radius-10.position-relative.service-wrapper.s-dp-1-3.h-dp-10-60.m-mb-50",
                                    m("div.media", [
                                        m("div.service-circle.position-relative.mb-4.text-active.bg-white.rounded-circle.d-flex.align-items-center.justify-content-center.s-dp-1-3",
                                            m("span.icofont-lungs.text-grad-1")
                                        ),
                                        m("div.media-body", [
                                            m("h4.text-dark2.mb-3.position-relative.pt-2",
                                                WidgetsSV.data[_v].SIGNO
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].VALOR + " RPM"
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].FECHA
                                            )
                                        ])
                                    ])
                                )
                            )
                        }

                        if (_v == 'SO' && WidgetsSV.data[_v].length !== 0) {
                            return m("div.col-sm-10.offset-sm-1.col-md-12.offset-md-0.col-xl-6",
                                m("div.single-service.bg-white.type-3.radius-10.position-relative.service-wrapper.s-dp-1-3.h-dp-10-60.m-mb-50",
                                    m("div.media", [
                                        m("div.service-circle.position-relative.mb-4.text-active.bg-white.rounded-circle.d-flex.align-items-center.justify-content-center.s-dp-1-3",
                                            m("span.icofont-stethoscope.text-grad-1")
                                        ),
                                        m("div.media-body", [
                                            m("h4.text-dark2.mb-3.position-relative.pt-2",
                                                "SATURACIÓN DE OXIGENO"
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].VALOR + " %"
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].FECHA
                                            )
                                        ])
                                    ])
                                )
                            )
                        }

                        if (_v == 'FIO' && WidgetsSV.data[_v].length !== 0) {
                            return m("div.col-sm-10.offset-sm-1.col-md-12.offset-md-0.col-xl-6",
                                m("div.single-service.bg-white.type-3.radius-10.position-relative.service-wrapper.s-dp-1-3.h-dp-10-60.m-mb-50",
                                    m("div.media", [
                                        m("div.service-circle.position-relative.mb-4.text-active.bg-white.rounded-circle.d-flex.align-items-center.justify-content-center.s-dp-1-3",
                                            m("span.icofont-stethoscope.text-grad-1")
                                        ),
                                        m("div.media-body", [
                                            m("h4.text-dark2.mb-3.position-relative.pt-2",
                                                "FIO2"
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].VALOR + " %"
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].FECHA
                                            )
                                        ])
                                    ])
                                )
                            )
                        }

                        if (_v == 'TEMP' && WidgetsSV.data[_v].length !== 0) {
                            return m("div.col-sm-10.offset-sm-1.col-md-12.offset-md-0.col-xl-6",
                                m("div.single-service.bg-white.type-3.radius-10.position-relative.service-wrapper.s-dp-1-3.h-dp-10-60.m-mb-50",
                                    m("div.media", [
                                        m("div.service-circle.position-relative.mb-4.text-active.bg-white.rounded-circle.d-flex.align-items-center.justify-content-center.s-dp-1-3",
                                            m("span.icofont-thermometer.text-grad-1")
                                        ),
                                        m("div.media-body", [
                                            m("h4.text-dark2.mb-3.position-relative.pt-2",
                                                "TEMPERATURA"
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].VALOR + " °C"
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].FECHA
                                            ),
                                            (Formulario.adm !== 1 ? [
                                                m("p.mb-4.text-white.fz-poppins.text-Underline.d-inline.pr-1.pl-1", {
                                                    style: { "cursor": "pointer", "background-color": "#ea7600" },
                                                    onclick: () => {
                                                        SignosVitales.nameReporte = "Curva Térmica";
                                                        SignosVitales.verReporte("http://172.16.253.18/report-executor/mvreport?name=USR_CURVA_TERMICA_SP&cdMultiEmpresa=1&cdAtendimento=" + Formulario.adm);
                                                    }
                                                },
                                                    m("span.icofont-patient-file"),

                                                    "Ver Curva Térmica"
                                                )
                                            ] : [])
                                        ])
                                    ])
                                )
                            )
                        }

                        if (_v == 'PS' && WidgetsSV.data[_v].length !== 0) {
                            return m("div.col-sm-10.offset-sm-1.col-md-12.offset-md-0.col-xl-6",
                                m("div.single-service.bg-white.type-3.radius-10.position-relative.service-wrapper.s-dp-1-3.h-dp-10-60.m-mb-50",
                                    m("div.media", [
                                        m("div.service-circle.position-relative.mb-4.text-active.bg-white.rounded-circle.d-flex.align-items-center.justify-content-center.s-dp-1-3",
                                            m("span.icofont-user-alt-1.text-grad-1")
                                        ),
                                        m("div.media-body", [
                                            m("h4.text-dark2.mb-3.position-relative.pt-2",
                                                "PESO"
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].VALOR + " °C"
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].FECHA
                                            )
                                        ])
                                    ])
                                )
                            )
                        }

                        if (_v == 'TA' && WidgetsSV.data[_v].length !== 0) {
                            return m("div.col-sm-10.offset-sm-1.col-md-12.offset-md-0.col-xl-6",
                                m("div.single-service.bg-white.type-3.radius-10.position-relative.service-wrapper.s-dp-1-3.h-dp-10-60.m-mb-50",
                                    m("div.media", [
                                        m("div.service-circle.position-relative.mb-4.text-active.bg-white.rounded-circle.d-flex.align-items-center.justify-content-center.s-dp-1-3",
                                            m("span.icofont-ruler.text-grad-1")
                                        ),
                                        m("div.media-body", [
                                            m("h4.text-dark2.mb-3.position-relative.pt-2",
                                                "TALLA"
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].VALOR + " cm."
                                            ),
                                            m("p.mb-4.text-default.fz-poppins.text-Underline",
                                                WidgetsSV.data[_v].FECHA
                                            )
                                        ])
                                    ])
                                )
                            )
                        }



                    })
                ]
            } else {
                return [
                    m(".alert.alert-danger[role='alert']",
                        "No existe información disponible."
                    )
                ]

            }
        }












    }
};

class SignosVitales {
    static data = [];
    static detalle = [];
    static error = "";
    static loader = true;
    static loadReporte = false;
    static nameReporte = "";
    static verReporteGlicemia(url) {
        SignosVitales.loader = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        m.request({
            method: "POST",
            url: "https://api.hospitalmetropolitano.org/v2/medicos/reportes",
            body: url,
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (response) {

                SignosVitales.loader = false;
                SignosVitales.loadReporte = true;

                let pdfData = atob(response.data);
                verDocPDF.loadBASE64(pdfData);
                // es para verific<r

            })
            .catch(function (e) {

            });

    }
    static verReporte(url) {
        SignosVitales.loader = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        m.request({
            method: "POST",
            url: "https://api.hospitalmetropolitano.org/v2/medicos/reportes",
            body: {
                url: url
            },
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (response) {

                SignosVitales.loader = false;
                SignosVitales.loadReporte = true;

                let pdfData = atob(response.data);
                verDocPDF.loadBASE64(pdfData);

            })
            .catch(function (e) {

            });

    }
    static fetch() {
        SignosVitales.data = [];
        SignosVitales.error = "";
        SignosVitales.loader = true;

        m.request({
            method: "POST",
            url: "https://api.hospitalmetropolitano.org/t/v1/sv-paciente-emergencia",
            body: {
                numeroHistoriaClinica: Paciente.nhc
            },
            headers: {
                "Authorization": localStorage.accessToken,
            },

        })
            .then(function (result) {
                SignosVitales.loader = false;
                if (result.status) {
                    SignosVitales.data = result.data;
                } else {
                    SignosVitales.error = result.message;
                }
            })
            .catch(function (e) {
                setTimeout(function () { SignosVitales.fetch(); }, 5000);

            })
    }



    view() {

        if (SignosVitales.loader) {
            return m(".tab-pane.fade.active.show[id='v-pills-sv'][role='tabpanel']", [
                m("h4.m-text-2.", [
                    m("i.icofont-heart-beat.mr-2"),
                    "Signos Vitales:"
                ]),
                m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                    "Hospital Metropolitano"
                ),
                m("h6.mb-5.d-flex", [
                    "Última información disponible. HIS MV.",

                ]

                ),
                m("div.text-center", [
                    m("div.loader-content",
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3.",)
                    )
                ])
            ]);
        } else {
            return SignosVitales.error ? [
                m(".tab-pane.fade.active.show[id='v-pills-sv'][role='tabpanel']", [
                    m("h4.m-text-2.", [
                        m("i.icofont-heart-beat.mr-2"),
                        "Signos Vitales:"
                    ]),
                    m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                        "Hospital Metropolitano"
                    ),
                    m(".alert.alert-danger[role='alert']",
                        SignosVitales.error
                    )


                ]),
            ] : (SignosVitales.data.length !== 0 && !SignosVitales.loadReporte) ? [
                m(".tab-pane.fade.active.show[id='v-pills-sv'][role='tabpanel']", [
                    m("h4.m-text-2.mt-50", [
                        m("i.icofont-heart-beat.mr-2"),
                        "Signos Vitales:"
                    ]

                    ),
                    m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                        "Hospital Metropolitano"
                    ),



                    m("h5.ml12.fadeInDown-slide.animated.text-light-dark",
                        "NHC: " + DetallePaciente.data.HC
                    ),
                    m("h5.ml12.fadeInDown-slide.animated.text-light-dark",
                        "Edad: " + DetallePaciente.data.EDAD + " Año(s)"
                    ),
                    m("h5.ml12.fadeInDown-slide.animated.text-light-dark",
                        "Médico: " + DetallePaciente.data.NOMBRE_MEDICO
                    ),
                    m("h5.ml12.fadeInDown-slide.animated.text-light-dark",
                        ((DetallePaciente.data.DG_PRINCIPAL !== null) ? "Dg: " + DetallePaciente.data.DG_PRINCIPAL : "Dg: NO DISPONIBLE")
                    ),
                    m("h5.ml12.fadeInDown-slide.animated.text-light-dark",
                        "Especialidad: " + DetallePaciente.data.ESPECIALIDAD
                    ),
                    m("h5.ml12.fadeInDown-slide.animated.text-light-dark.mb-3", [
                        ((DetallePaciente.data.NRO_HABITACION !== null) ? "Ubicación: " + DetallePaciente.data.NRO_HABITACION : "Ubicación: NO DISPONIBLE"),
                        ((DetallePaciente.data.DISCRIMINANTE == 'EMA') ? " En Emergencia " : " En Hospitalización ")
                    ]),

                    m("hr"),
                    m("div.row", [
                        m(WidgetsSV)
                    ]),
                    m("h6.mb-5.d-flex", [
                        "Última información disponible. HIS MV.",


                    ]

                    )
                ]),
            ] : [
                [(verDocPDF.show.length == 0) ? [
                    m("h4.m-text-2.",
                        m("i.icofont-file-image.mr-2"),
                        "Resultados de Imagen:"
                    ),
                    m("h6.text-light-dark.ff-roboto.pb-40.mb-0",
                        "Hospital Metropolitano"
                    ),


                ] : [

                    m("div.row", [
                        m("div.text-center.w-100", [
                            m("img.m-1.d-inline[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='200rem']"),
                            m("p.m-text-2.p-0.m-0",
                                m("i.icofont-file-alt.mr-2"), SignosVitales.nameReporte

                            ),
                        ])
                    ])
                ]],


            ]
        }





    }
}

class DetallePaciente {
    static data = [];
    static detalle = [];
    static error = "";
    static loadPaciente() {
        SignosVitales.fetch();
        Evoluciones.fetch();


    }
    static fetch() {
        DetallePaciente.data = [];
        DetallePaciente.error = "";
        m.request({
            method: "POST",
            url: "https://api.hospitalmetropolitano.org/t/v1/status-paciente-emergencia",
            body: {
                numeroHistoriaClinica: Paciente.nhc
            },
            headers: {
                "Authorization": localStorage.accessToken,
            },
        })
            .then(function (result) {
                if (result.status) {
                    DetallePaciente.data = result.data;
                    DetallePaciente.loadPaciente();
                } else {
                    DetallePaciente.error = "No existe información disponible. La ubicación del paciente ya no es Emergencia ni Hospitalización.";
                }
            })
            .catch(function (e) {
                setTimeout(function () { DetallePaciente.fetch(); }, 5000);
            })
    }
    view() {
        return [
            m("div.col-md-4." + DetalleClinico.inZoom,
                m("div.department-tab-pill.m-pt-140.m-pb-140.position-relative.", [
                    m("i.icofont-prescription.text-white.fz-40", { "style": { "margin-left": "-5px" } }),
                    m("h2.text-white.pb-md-5", [
                        DetallePaciente.data.NOMBRE_PACIENTE
                    ]),

                    m(".nav.pt-md-0.flex-column.nav-pills[id='v-pills-tab'][role='tablist'][aria-orientation='vertical']", [
                        m("a.nav-link.active[data-toggle='pill'][role='tab']", {
                            href: '#v-pills-sv',
                            class: (SignosVitales.loader ? "d-none" : ""),
                            onclick: (e) => {
                                e.preventDefault();
                                MenuBoton.update = "SV";
                            },

                        }, [
                            m("i.icofont-heart-beat"),
                            m("span",
                                " Signos Vitales "
                            )
                        ]),
                        m("a.nav-link[data-toggle='pill'][role='tab']", {
                            href: '#v-pills-ev',
                            class: (Evoluciones.loader ? "d-none" : ""),
                            onclick: (e) => {
                                e.preventDefault();
                                MenuBoton.update = "EV";
                            },
                        }, [
                            m("i.icofont-prescription"),
                            m("span", [
                                "Evoluciones ",
                                m('br'),
                                "Prescripciones "
                            ])
                        ]),
                        m("a.nav-link[data-toggle='pill'][role='tab']", {
                            href: '#v-pills-lab',
                            class: (Laboratorio.loader ? "d-none" : ""),
                            onclick: (e) => {
                                e.preventDefault();
                                MenuBoton.update = "LAB";
                            },
                        }, [
                            m("i.icofont-laboratory"),
                            m("span",
                                " Laboratorio "
                            )
                        ]),
                        m("a.nav-link[data-toggle='pill'][role='tab']", {
                            href: '#v-pills-imagen',
                            class: (Imagen.loader ? "d-none" : ""),
                            onclick: (e) => {
                                e.preventDefault();
                                MenuBoton.update = "RX";
                            }

                        }, [
                            m("i.icofont-file-image"),
                            m("span",
                                " Imagen "
                            )
                        ])

                    ])
                ])
            ),
        ]

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
    static typeDoc = "SV";
    static setComand() {

        if (MenuBoton.update == "SV") {
            SignosVitales.fetch();
        }

        if (MenuBoton.update == "EV") {
            Evoluciones.fetch();
        }

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

            if (verDocPDF.url == 'base64') {

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
                        m("div.button-menu-right-p1", { "style": { "display": "flex" } }, [
                            m("div.text-primary.mr-2", "Cerrar"),
                            m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    verDocPDF.show = "";
                                    verDocPDF.url = "";
                                    verDocPDF.tab = "";
                                    verDocPDF.tabImagen = "";
                                    verDocPDF.numPage = 0;
                                    verDocPDF.pageNum = 1;
                                    DetalleClinico.inZoom = "";
                                    SignosVitales.loadReporte = false;

                                },
                            },
                                m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                            )

                        ]

                        )
                    ];
                } else {
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
                            m("div.text-primary.mr-2", "Cerrar"),
                            m("btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                                onclick: (e) => {
                                    verDocPDF.show = "";
                                    verDocPDF.url = "";
                                    verDocPDF.tab = "";
                                    verDocPDF.tabImagen = "";
                                    verDocPDF.numPage = 0;
                                    verDocPDF.pageNum = 1;
                                    DetalleClinico.inZoom = "";
                                    SignosVitales.loadReporte = false;

                                },
                            },
                                m("i.icofont-close-circled", { "style": { "font-size": "x-large" } })

                            )

                        ]

                        )

                    ]
                }





            } else {


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
                        m("div.button-menu-right-p1", { "style": { "display": "flex" } }, [
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
                        m("div.button-menu-right-2", { "style": { "display": "flex" } }, [
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
                        m("div.button-menu-right-p3", { "style": { "display": "flex" } }, [
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
        MenuBoton.update = "SV";
        DetallePaciente.fetch();
    }
    view() {
        return DetallePaciente.error ? [
            m("div.container",
                m("div.m-pt-50.text-center", [
                    m(".alert.alert-danger[role='alert']", [
                        DetallePaciente.error,
                        " Ver Información disponible.",
                        m("a", {
                            href: "/resultados/paciente/" + Paciente.nhc
                        }, " Click Aquí"),

                    ]

                    )
                ])
            )
        ] : DetallePaciente.data.length !== 0 ? [
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
                        m(DetallePaciente),
                        m("div", {
                            class: (DetalleClinico.inZoom.length !== 0) ? "col-md-12" : "col-md-8"
                        }, [
                            m("div.tab-content.m-pb-140.", {
                                class: (DetalleClinico.inZoom.length === 0) ? "m-pt-130" : "m-pt-40"
                            }, [
                                m(SignosVitales),
                                m(Evoluciones),
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


class Paciente extends App {
    static nhc = null;
    constructor() {
        super();
    }
    oninit(_data) {
        Paciente.nhc = _data.attrs.nhc;

        DetallePaciente.data = [];
        Evoluciones.data = [];
        Formulario.data = [];
        Imagen.data = [];
        SignosVitales.data = [];

    }
    oncreate() {
        this.mainLayout();
        this._setTitle = "Detalle del Paciente";



    }
    view() {

        return [
            m("div." + ((VisorRis.show.length === 0) ? "" : "d-none"), [
                (DetalleClinico.inZoom.length === 0) ? m(HeaderPublic) : "",
                m(DetalleClinico)
            ]),
            m("div." + ((VisorRis.show.length === 0) ? "d-none" : ""), [
                m(VisorRis)
            ])
        ];

    }

};



export default Paciente;