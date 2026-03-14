-----------------------------------------------------------
To build scss to css
** Use gulp :
npm i
gulp
** or not, build regular
sass --watch src/scss:public/css
-----------------------------------------------------------
** Fadein
Example: 
<section class="js_inview fadeup">
-----------------------------------------------------------------
covert images to webp
npm install --save-dev gulp-webp
gulp img
-----------------------------------------------------------------
** font size , plz use @extend
Ex : 
@extend %fz-18;
