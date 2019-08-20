const isOutside = {
    install: function (Vue) {
        Vue.directive('mousedown-outside', {
            bind: function (el, binding, vNode) {

                // Provided expression must evaluate to a function.
                if (typeof binding.value !== 'function') {
                    const compName = vNode.context.name;
                    let warn = `[Vue-mousedown-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
                    if (compName) {
                        warn += `Found in component '${compName}'`;
                    }
                    // eslint-disable-next-line
                    console.warn(warn);
                }

                // Define Handler and cache it on the element
                const bubble = binding.modifiers.bubble;
                const handler = (e) => {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e);
                    }
                }
                el.__vueMousedownOutside__ = handler;

                // add Event Listeners
                document.addEventListener('mousedown', el.__vueMousedownOutside__);
            },
            unbind: function (el) {

                // Remove Event Listeners
                document.removeEventListener('mousedown', el.__vueMousedownOutside__);
                el.__vueMousedownOutside__ = null;
            }
        });

        Vue.directive('mouseup-outside', {
            bind: function (el, binding, vNode) {

                // Provided expression must evaluate to a function.
                if (typeof binding.value !== 'function') {
                    const compName = vNode.context.name;
                    let warn = `[Vue-mouseup-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
                    if (compName) {
                        warn += `Found in component '${compName}'`;
                    }
                    // eslint-disable-next-line
                    console.warn(warn);
                }

                // Define Handler and cache it on the element
                const bubble = binding.modifiers.bubble;
                const handler = (e) => {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e);
                    }
                }
                el.__vueMouseupOutside__ = handler;

                // add Event Listeners
                document.addEventListener('mouseup', el.__vueMouseupOutside__);
            },
            unbind: function (el) {

                // Remove Event Listeners
                document.removeEventListener('mouseup', el.__vueMouseupOutside__);
                el.__vueMouseupOutside__ = null;
            }
        });

        Vue.directive('click-outside', {
            bind: function (el, binding, vNode) {

                // Provided expression must evaluate to a function.
                if (typeof binding.value !== 'function') {
                    const compName = vNode.context.name;
                    let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
                    if (compName) {
                        warn += `Found in component '${compName}'`;
                    }
                    // eslint-disable-next-line
                    console.warn(warn);
                }

                // Define Handler and cache it on the element
                const bubble = binding.modifiers.bubble;
                const handler = (e) => {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e);
                    }
                }
                el.__vueClickOutside__ = handler;

                // add Event Listeners
                document.addEventListener('click', el.__vueClickOutside__);
            },
            unbind: function (el) {

                // Remove Event Listeners
                document.removeEventListener('click', el.__vueClickOutside__);
                el.__vueClickOutside__ = null;
            }
        });

    }
}
export default isOutside