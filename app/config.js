define(function() {

    var baseContentUrl = 'http://pipes.yahoo.com/pipes/pipe.run';
    baseContentUrl += '?_id=b661dd58aed9c23ade7bae0d7bc148cd&_render=json';
    baseContentUrl += '&xpath=%2F%2Fsection%5Bcontains%28%40class%2C+%27content%27%29%5D&url=';

    return {
        delay: 120000,
        baseContentUrl: baseContentUrl,
        yqlPublicUrl: 'http://query.yahooapis.com/v1/public/yql',
        defaultFeeds: [
            {title: 'Stack Overflow', url: 'http://stackoverflow.com/feeds/tag?tagnames=durandal&sort=newest'},
            {title: 'Google Groups', url: 'https://groups.google.com/forum/feed/durandaljs/msgs/atom.xml?num=15'}
        ]
    };
});