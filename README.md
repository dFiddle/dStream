# dStream
### Live: [http://dfiddle.github.io/dStream/]
>  **2013/08/19**: Updated to release version of [Durandal] 2.0.0

### What is it?

A pet project that uses a cut down version of [Durandal 2.0.0], hosted as a Github repo with only one gh-pages
branch.
It serves three purposes:

#### 1. having a single place to stay informed about what's new in Durandal's universe
- it acts as a stream viewer for a merged feed of Durandal questions on stackoverflow and google groups
- No real **streaming** though as [YQL], which is used to merge feeds on the server side,
has no documented support for it. New posts are added to the local feed using _first in
first out_. Feed will be updated on a regular basis, so just leave your browser open
- add other atom feeds e.g. your private github feed. Optionally store your selection using `localstorage`

>**Warning** system doesn't do any vanity checks and will blow up if no valid atom xml is returned


#### 2. searching the Durandal documentation while streaming
- not sure what `activate` really does, but the whole world is talking about it?
- double click on anything in the stream that might be in Durandal's documentation
- see search results on a dedicated search page
- fetch complete article by clicking on a result header
- use browser back button to return to stream view

#### 3. it's a small, educational [Durandal 2.0.0] app
- it puts together a couple of concepts demoed in the default samples ([dFiddle-2.0])
- it's not a best practice app! I leave that up to @EisenbergEffect `:)`
- it's not meant as a replacement for any real feed reader app and there are no plans to add more features...
- ... or to make it more robust. If something breaks feel free to fix it.


Enjoy,

Rainer


[Durandal]:http://durandaljs.com/
[Durandal 2.0.0]:https://github.com/BlueSpire/Durandal/releases/tag/2.0.0
[dFiddle-2.0]:https://github.com/dFiddle/dFiddle-2.0
[YQL]:http://developer.yahoo.com/yql/console/
[http://dfiddle.github.io/dStream/]:http://dfiddle.github.io/dStream/