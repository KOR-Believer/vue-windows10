const Selected = {
    install: function (Vue) {
        Vue.directive('selected', {
            bind: function (el, binding, vNode) {

                const intersects = function (ela, elb, mode = 'touch') {
                    const a = ela.getBoundingClientRect();
                    const b = elb.getBoundingClientRect();
                    if (mode === 'center') {
                        const bxc = b.left + b.width / 2;
                        const byc = b.top + b.height / 2;
                        return bxc >= a.left
                            && bxc <= a.right
                            && byc >= a.top
                            && byc <= a.bottom;
                    } else if (mode === 'cover') {
                        return b.left >= a.left
                            && b.top >= a.top
                            && b.right <= a.right
                            && b.bottom <= a.bottom;
                    } else if (mode === 'touch') {
                        return a.right >= b.left
                            && a.left <= b.right
                            && a.bottom >= b.top
                            && a.top <= b.bottom;
                    }
                }

                const onTabMove = () => {
                    let icon = el
                    let selection = binding.value.$refs.selection
                    if (intersects(icon, selection)) {
                        vNode.componentInstance.iconSelected = true
                    } else {
                        vNode.componentInstance.iconSelected = false
                    }
                }

                const onTabEnd = () => {
                    document.removeEventListener('mousemove',el.__vueOnTabMove__)
                    el.__vueOnTabMove__ = null
                    document.removeEventListener('mouseup',el.__vueOnTabEnd__)
                    el.__vueOnTabEnd__ = null
                }

                const onTabStart = () => {
                    el.__vueOnTabMove__ = onTabMove
                    document.addEventListener('mousemove',el.__vueOnTabMove__)
                    el.__vueOnTabEnd__ = onTabEnd
                    document.addEventListener('mouseup',el.__vueOnTabEnd__)
                }

                el.__vueOnTabStart__ = onTabStart;
                document.addEventListener('mousedown', el.__vueOnTabStart__);
            },
            unbind: function (el) {
                document.removeEventListener('mousedown',el.__vueOnTabStart__)
                el.__vueOnTabStart__ = null
            }
        })
    }
}
export default Selected