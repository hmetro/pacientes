import m from "mithril";

const ButtonReload = {

    view: () => {
        return [

            m("div.button-menu-right-reload." + Loader.buttonShow, { "style": { "display": "flex" } },
                m("a.btn.fadeInDown-slide.position-relative.animated.pl-3.pr-3.lsp-0.no-border.bg-transparent.medim-btn.grad-bg--3.solid-btn.mt-0.text-medium.radius-pill.text-active.text-white.s-dp-1-2", {
                    onclick: (e) => {
                        e.preventDefault();
                        window.location.reload();
                    },
                },
                    m("i.icofont-refresh", { "style": { "font-size": "x-large" } })
                )
            )
        ];

    },
};


class Loader {

    show = "d-none";
    buttonShow = "d-none";
    loaderInicio;
    loaderPage;
    message;

    constructor(data) {
        this.loaderInicio = data.attrs.loaderInicio;
        this.loaderPage = data.attrs.loaderPage;
        this.message = data.attrs.message;


    }

    oninit() {
        if (this.loaderInicio) {
            this.view = this.inicio;
        }

        if (this.loaderPage) {
            this.view = this.page;
        }
    }

    view() {

    }

    page() {
        return [

            m("div.preloader",
                m("div.preloader-inner",
                    m("div.loader-content.text-center",
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3"),
                        m('br'),
                        m("p", this.message),
                    ),

                ),




            ),


            m(ButtonReload),

        ];
    }

    inicio() {
        return [

            m("div.preloader",
                m("div.preloader-inner",
                    m("div.loader-content",
                        m("span.icon-section-wave.d-inline-block.text-active.mt-3.",),
                    )
                ),


            ),

            m(ButtonReload),
        ];
    }

}




export default Loader;