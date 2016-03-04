describe('d3', () => {
    'use strict';

    var d3 = window.d3;

    it('exists', () => {
        expect(d3).not.toBeNull();
        expect(typeof d3).toBe('object');
    });
});
