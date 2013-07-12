# dStream
## rough cut, use on your own risk!


### What is it?

A pet project that uses a cut down version of [Durandal 2.0.0 pre], hosted as a Github repo with only one gh-pages
branch.
It serves three purposes:

#### having a single place to stay informed about what's new in Durandal's universe
- it acts as a stream viewer for a merged feed of Durandal questions on stackoverflow and google groups
- No realy **streaming** though as **YQL**, which is used to merge feeds on the server side,
has no documented support for it. New posts are added to the local feed using _first in
first out_. Feed will be updated on a regular basis, so just leave your browser open
- add other atom feeds e.g. your private github feed. Optionally store your selection using `localstorage`

>**Warning** system doesn't do any vanity checks and will blow up if no valid atom xml is returned


#### not sure what `activate` really does, but the whole world is talking about it?
- double click on anything in the stream that might be in Durandal's documentation (version 1.2 for the time being)
- see search results on a dedicated search page
- fetch complete article by clicking on a result header
- use browser back button to return to stream view

#### it's a small [Durandal 2.0.0 pre] app that puts together a couple of concepts demoed in the default samples ([dFiddle-2.0])
- it's not meant as a replacement for any real feed reader app and there are no plans to add more features
- that said once Durandal's 2.0 documentation becomes available it will be integrated

If you find things that could be improved feel free to send a pull request.

Enjoy,

Rainer


[Durandal]:http://durandaljs.com/
[Durandal 2.0.0 pre]:https://github.com/BlueSpire/Durandal/releases/tag/v2.0.0-pre
[dFiddle-2.0]:https://github.com/dFiddle/dFiddle-2.0