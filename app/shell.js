define(['plugins/router'], function (router) {
    
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', moduleId: 'stream/index', title: 'stream' },
                { route: 'search', moduleId: 'search/index', title: 'Search', nav: true },
                { route: 'search*details', moduleId: 'search/index', title: 'Search', hash: '#search' }
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});