
# esformatter-jsx - Changelog
## v1.3.0
- **Enhancements**
  - Make more predictive the parsing of jsx tags - [ca7f190]( https://github.com/[object Object]/esformatter-jsx/commit/ca7f190 ), [royriojas](https://github.com/royriojas), 17/06/2015 03:07:13

    
- **Bug Fixes**
  - remove initial and final text surrounding a tag to prevent react from creating span tags - [916c0b2]( https://github.com/[object Object]/esformatter-jsx/commit/916c0b2 ), [royriojas](https://github.com/royriojas), 17/06/2015 02:05:36

    
## v1.1.1
- **Build Scripts Changes**
  - simplify bump task - [c4b9582]( https://github.com/[object Object]/esformatter-jsx/commit/c4b9582 ), [royriojas](https://github.com/royriojas), 16/06/2015 22:45:25

    
  - Add changelogx generation task - [8b4948e]( https://github.com/[object Object]/esformatter-jsx/commit/8b4948e ), [royriojas](https://github.com/royriojas), 16/06/2015 22:44:39

    
  - Add prepush config section - [76c53e2]( https://github.com/[object Object]/esformatter-jsx/commit/76c53e2 ), [royriojas](https://github.com/royriojas), 16/06/2015 22:42:00

    
- **Refactoring**
  - update to use falafel-espree - [779afc9]( https://github.com/[object Object]/esformatter-jsx/commit/779afc9 ), [royriojas](https://github.com/royriojas), 16/06/2015 22:39:45

    
## v1.0.9
- **Features**
  - Ternary operators in jsx will try to remain in the same line - [eb1ee17]( https://github.com/[object Object]/esformatter-jsx/commit/eb1ee17 ), [royriojas](https://github.com/royriojas), 16/06/2015 04:22:31

    
  - adding mocha runner - [6a503cb]( https://github.com/[object Object]/esformatter-jsx/commit/6a503cb ), [royriojas](https://github.com/royriojas), 16/06/2015 02:17:22

    
- **Bug Fixes**
  - Fix for nested jsx structures issue - [f10a429]( https://github.com/[object Object]/esformatter-jsx/commit/f10a429 ), [Roy Riojas](https://github.com/Roy Riojas), 09/03/2015 13:45:51

    Fixes an issue reported under esformatter-jsx-ignore when using nested jsx blocks.
    
    Check the readme for details about this issue.
    
- **Documentation**
  - minor cosmetic change to make the comments in the json structure be properly highlighted - [5f76bb9]( https://github.com/[object Object]/esformatter-jsx/commit/5f76bb9 ), [Roy Riojas](https://github.com/Roy Riojas), 03/03/2015 04:20:04

    
  - Add comment about the best configuration to work with JSX files - [6a1135f]( https://github.com/[object Object]/esformatter-jsx/commit/6a1135f ), [Roy Riojas](https://github.com/Roy Riojas), 02/03/2015 10:59:19

    
  - Add example url - [c39b4cc]( https://github.com/[object Object]/esformatter-jsx/commit/c39b4cc ), [Roy Riojas](https://github.com/Roy Riojas), 28/02/2015 01:08:08

    
- **Build Scripts Changes**
  - bump minor version - [0dc5f6a]( https://github.com/[object Object]/esformatter-jsx/commit/0dc5f6a ), [Roy Riojas](https://github.com/Roy Riojas), 28/02/2015 01:09:12

    
- **Tests Related fixes**
  - Add test for the case of an already formatted component - [4d28556]( https://github.com/[object Object]/esformatter-jsx/commit/4d28556 ), [Roy Riojas](https://github.com/Roy Riojas), 27/02/2015 01:31:11

    
#### tag attributes
- **Bug Fixes**
  - prevent some tags from been formatted using the same escape list from `js-beautify.html` related to [#1](https://github.com/[object Object]/esformatter-jsx/issues/1) - [3c2e2f7]( https://github.com/[object Object]/esformatter-jsx/commit/3c2e2f7 ), [Roy Riojas](https://github.com/Roy Riojas), 01/03/2015 20:27:37

    
  - only try to format the attributes if the flag `attrsOnSameLineAsTag` is not true - [e1b9525]( https://github.com/[object Object]/esformatter-jsx/commit/e1b9525 ), [Roy Riojas](https://github.com/Roy Riojas), 01/03/2015 18:29:50

    
- **Tests Related fixes**
  - Update tests - [4f1364b]( https://github.com/[object Object]/esformatter-jsx/commit/4f1364b ), [Roy Riojas](https://github.com/Roy Riojas), 01/03/2015 18:36:21

    
- **Documentation**
  - Fixed quotes in the json configuration section in the README - [4ab8683]( https://github.com/[object Object]/esformatter-jsx/commit/4ab8683 ), [Roy Riojas](https://github.com/Roy Riojas), 01/03/2015 16:56:32

    
- **Features**
  - Add option to format the attributes of a tag. Fix [#1](https://github.com/[object Object]/esformatter-jsx/issues/1) - [653fad8]( https://github.com/[object Object]/esformatter-jsx/commit/653fad8 ), [Roy Riojas](https://github.com/Roy Riojas), 01/03/2015 16:53:15

    
## v1.0.1
- **Documentation**
  - Fix formatting of the config example - [ef95fd7]( https://github.com/[object Object]/esformatter-jsx/commit/ef95fd7 ), [Roy Riojas](https://github.com/Roy Riojas), 27/02/2015 01:17:06

    
## v1.0.0
- **Documentation**
  - Improved documentation - [b1e0c75]( https://github.com/[object Object]/esformatter-jsx/commit/b1e0c75 ), [Roy Riojas](https://github.com/Roy Riojas), 27/02/2015 01:14:46

    
  - Fix incorrect plugin name in Readme - [2c6798a]( https://github.com/[object Object]/esformatter-jsx/commit/2c6798a ), [Roy Riojas](https://github.com/Roy Riojas), 24/02/2015 14:19:04

    
  - Fix the build badge - [3988916]( https://github.com/[object Object]/esformatter-jsx/commit/3988916 ), [Roy Riojas](https://github.com/Roy Riojas), 24/02/2015 03:20:00

    
  - Add a note about the failure to load the plugin using the configuration JSON - [13a137a]( https://github.com/[object Object]/esformatter-jsx/commit/13a137a ), [Roy Riojas](https://github.com/Roy Riojas), 24/02/2015 02:52:32

    
  - Better Readme - [df8d9c1]( https://github.com/[object Object]/esformatter-jsx/commit/df8d9c1 ), [Roy Riojas](https://github.com/Roy Riojas), 24/02/2015 02:24:49

    
- **Build Scripts Changes**
  - First commit - [c8d4d2b]( https://github.com/[object Object]/esformatter-jsx/commit/c8d4d2b ), [Roy Riojas](https://github.com/Roy Riojas), 27/02/2015 01:13:55

    
  - Bump minor version - [66cd811]( https://github.com/[object Object]/esformatter-jsx/commit/66cd811 ), [Roy Riojas](https://github.com/Roy Riojas), 26/02/2015 20:21:31

    
  - Update to latest fresh-falafel - [541d12c]( https://github.com/[object Object]/esformatter-jsx/commit/541d12c ), [Roy Riojas](https://github.com/Roy Riojas), 26/02/2015 20:21:08

    
  - Bump the minor version - [dd3c10c]( https://github.com/[object Object]/esformatter-jsx/commit/dd3c10c ), [Roy Riojas](https://github.com/Roy Riojas), 24/02/2015 03:27:43

    
  - Update fresh falafel dep - [6d0ccf5]( https://github.com/[object Object]/esformatter-jsx/commit/6d0ccf5 ), [Roy Riojas](https://github.com/Roy Riojas), 24/02/2015 03:27:11

    
  - Bump the build version - [caa3306]( https://github.com/[object Object]/esformatter-jsx/commit/caa3306 ), [Roy Riojas](https://github.com/Roy Riojas), 24/02/2015 03:20:35

    
  - Add missing travis.yml - [e6c0d3a]( https://github.com/[object Object]/esformatter-jsx/commit/e6c0d3a ), [Roy Riojas](https://github.com/Roy Riojas), 24/02/2015 03:10:48

    
  - First commit - [75264a5]( https://github.com/[object Object]/esformatter-jsx/commit/75264a5 ), [Roy Riojas](https://github.com/Roy Riojas), 24/02/2015 02:09:29

    
- **Other changes**
  - Add esprima-fb as peer dependecy to make travis happy - [1e73618]( https://github.com/[object Object]/esformatter-jsx/commit/1e73618 ), [Roy Riojas](https://github.com/Roy Riojas), 24/02/2015 03:14:20

    
  - Initial commit - [aad4a63]( https://github.com/[object Object]/esformatter-jsx/commit/aad4a63 ), [Roy Riojas](https://github.com/Roy Riojas), 24/02/2015 01:48:19

    
