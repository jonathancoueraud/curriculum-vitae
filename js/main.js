(function() {
    'use strict';

    const randomElems = Array.prototype.slice.apply(document
        .querySelectorAll('.js_random'));
    const printElems = Array.prototype.slice.apply(document
        .querySelectorAll('.js_print'));
    const fabButtonElem = document.querySelector('.js_fab-button');

    bindPrintClick(printElems);
    // bindFabClick(fabButtonElem);
    // bindScroll(fabButtonElem);
    bindClickPaint(randomElems);

    function bindPrintClick(elem) {
        elem.map(function(elem) {
            elem.addEventListener('click', function(e) {
                window.print();
            });
        });
    }

    function bindFabClick(elem) {
        elem.addEventListener('click', function() {
            bindScroll(elem);
        });
    }

    function bindScroll(elem) {
        document.addEventListener('scroll', function onScroll() {
            elem.checked = false;
            document.removeEventListener('scroll', onScroll);
        });
    }

    function bindClickPaint(elems) {
        elems.map(function(elem) {
            const fabButtonRoot = elem.parentElement;
            const cvElems = Array.prototype.slice.apply(fabButtonRoot.parentElement.querySelectorAll('.js_cv'));

            elem.addEventListener('click', function(e) {
                let next = cvElems.reduce(function(prev, crr, index) {
                    if (!crr.classList.contains('hidden')) {
                        crr.classList.add('hidden');
                        return (index + 1) % cvElems.length;
                    } else {
                        return prev;
                    }
                }, 0);

                if ((next !== undefined) && cvElems[next]) {
                    cvElems[next].classList.remove('hidden');
                }
            });
        });
    }
}());


