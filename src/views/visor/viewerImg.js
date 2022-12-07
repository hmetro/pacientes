import App from "../app";

class VisorRis {
    static show = "";
    static url = "";
    static idExamen = "";
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
            m("div", [
                m("iframe", {
                    src: VisorRis.url,
                    "style": {
                        "frameborder": "0",
                        "width": "100%",
                        "height": "85vh"
                    }
                })
            ]),
            m("div.button-menu-left-copy.mt-10", { "style": { "display": "flex" } },
                m("div", [


                    m("img.p-1.mt-10[src='assets/logo.metrovirtual.png'][alt='Metrovirtual'][width='150rem']"),

                    m(".",
                        m("i.icofont-file-image.mr-2"),
                        "Visor de Resultados"
                    ),
                    m("h6.text-light-dark.ff-roboto",
                        "Hospital Metropolitano"
                    ),

                ]),
            ),
            m("div.button-menu-right-p1", { "style": { "display": (ViewerImg.hashId !== null ? "flex" : "none"), "right": "9rem" } },
                m("a.btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2[href='/resultado/i/" + ViewerImg.hashId + "'][target='_blank']", {

                }, [
                    m("i.icofont-file-alt"),

                    " Ver Informe"

                ])
            ),


            m("div.button-menu-right-p1", { "style": { "display": "flex" } },
                m("button.btn.fadeInDown-slide.position-relative.animated.pl-4.pr-4.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2[type='button']", {
                    onclick: () => {
                        alert('Si tienes inconvenientes con este resultado. Escríbenos a nuestra Mesa de Ayuda concas@hmetro.med.ec. Tel: 02 399 8000 Ext: 2020.');
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
            console.log(_params);
        }

        this._setTitle = "Visor de Resultados";

    }


    view() {

        return [
            m(VisorRis)
        ];

    }



};

export default ViewerImg;