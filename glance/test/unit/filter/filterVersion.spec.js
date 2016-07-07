describe('version filter', function () {

    var $filter;

    beforeEach(module('glance.image'));

    beforeEach(inject(function (_$filter_) {
        $filter = _$filter_;
    }));

    it('returns version when arg is version', function () {
        var filter = $filter('filterVersion');
        expect(filter('blackicebird/2048:latest', 'version')).toEqual('latest');
    });

    it('returns url when arg is url', function () {
        var filter = $filter('filterVersion');
        expect(filter('blackicebird/2048:latest', 'url')).toEqual('blackicebird/2048');
    });
});