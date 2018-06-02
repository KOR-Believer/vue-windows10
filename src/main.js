import 'babel-polyfill'
import 'eligrey-classlist-js-polyfill'
import './modifiedModules/setdragimage-ie'

import Vue from 'vue'
import App from './app.vue'
import { store } from './store'

var DragAndDrop = {
    install: function (Vue) {
        var self = {
            bind: function (el, binding, vnode) {
                self.handleDragStart = function (e) {
                    e.dataTransfer.effectAllowed = 'none';
                    // Need to set to something or else drag doesn't start
                    e.dataTransfer.setData('text', '*');
                    vnode.context.$emit('drag-start', e);
                }.bind(self);

                self.handleDragOver = function (e) {
                    if (e.preventDefault) {
                        // allows dropping
                        e.preventDefault();
                    }
                    e.dataTransfer.dropEffect = 'none';
                    e.target.classList.add('drag-over');
                    vnode.context.$emit('drag-over');

                    return false;
                }.bind(self);

                self.handleDragEnter = function (e) {
                    vnode.context.$emit('drag-enter');
                    e.target.classList.add('drag-enter');
                }.bind(self);

                self.handleDragLeave = function (e) {
                    vnode.context.$emit('drag-leave');
                    e.target.classList.remove('drag-enter', 'drag-over');
                }.bind(self);

                self.handleDrag = function () {
                    vnode.context.$emit('drag');
                }.bind(self);

                self.handleDragEnd = function (e) {
                    e.target.classList.remove('dragging', 'drag-over', 'drag-enter');
                    vnode.context.$emit('drag-end');
                }.bind(self);

                self.handleDrop = function (e) {
                    e.preventDefault();
                    if (e.stopPropagation) {
                        // stops the browser from redirecting.
                        e.stopPropagation();
                    }

                    // Don't do anything if dropping the same column we're dragging.
                    vnode.context.$emit('drop');

                    return false;
                }.bind(self);

                // setup the listeners
                el.setAttribute('draggable', 'true');
                el.addEventListener('dragstart', self.handleDragStart, false);
                el.addEventListener('dragenter', self.handleDragEnter, false);
                el.addEventListener('dragover', self.handleDragOver, false);
                el.addEventListener('drag', self.handleDrag, false);
                el.addEventListener('dragleave', self.handleDragLeave, false);
                el.addEventListener('dragend', self.handleDragEnd, false);
                el.addEventListener('drop', self.handleDrop, false);
            },
            unbind: function (el) {
                // shut er' down
                el.classList.remove('dragging', 'drag-over', 'drag-enter');
                el.removeAttribute('draggable');
                el.removeEventListener('dragstart', self.handleDragStart);
                el.removeEventListener('dragenter', self.handleDragEnter);
                el.removeEventListener('dragover', self.handleDragOver);
                el.removeEventListener('dragleave', self.handleDragLeave);
                el.removeEventListener('drag', self.handleDrag);
            }
        };
        Vue.directive('drag-and-drop', self);
    }
};
Vue.use(DragAndDrop);


new Vue({
  el: '#app',
  store,
  render: h => h(App)
});

