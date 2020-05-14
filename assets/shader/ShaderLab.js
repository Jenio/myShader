
const MVP = `
uniform mat4 viewProj;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 uv0;
void main () {
    vec4 pos = viewProj * vec4(a_position, 1);
    gl_Position = pos;
    uv0 = a_uv0;
}`;
const flipFrag = `
uniform sampler2D texture;
uniform sampler2D subtexture;
uniform vec2 foward;
uniform vec2 size;
uniform float radius;
uniform float distance;
uniform float moveAjustDistance;
varying vec2 uv0;

vec2 size1 =vec2(0.);
    float maxDistance = 0.0;
    float minDistance = 0.0;
void showLayer1(vec2 uv){
    vec2 uv1=uv * size1;
    vec2 center = vec2(0.5, 0.5)*size1;
    vec2 pos1 =uv1-center;


    if(dot(pos1,foward)>distance+minDistance){
        gl_FragColor = texture2D(texture, uv);
    }
}
void showLayer2(vec2 uv){
    vec2 uv1=uv * size1;
    vec2 center = vec2(0.5, 0.5)*size1;
    vec2 pos1 =uv1-center;

    if(dot(pos1,foward)>distance+minDistance-radius&&dot(pos1,foward)<distance+minDistance){
        float toCenter=dot(pos1,foward);
        float x=toCenter-distance-minDistance;
        float alpha=asin(x/radius);
        float r1=alpha*radius;
        float delta = r1-x;
        vec2 target=uv1+delta*foward;
        vec2 target2 = target/size1;
        if(target2.x>0.0&&target2.x<1.0&&target2.y>0.0&&target2.y<1.0){
            gl_FragColor = texture2D(texture,target2);
        }
    }
}
void showLayer3(vec2 uv){
    vec2 uv1=uv * size1;
    vec2 center = vec2(0.5, 0.5)*size1;
    vec2 pos1 =uv1-center;
    if(dot(pos1,foward)>distance+minDistance-radius&&dot(pos1,foward)<distance+minDistance){
        float toCenter=dot(pos1,foward);
        float x=toCenter-distance-minDistance;
        float alpha=asin(x/radius);
        float r1=-3.141592654*radius-alpha*radius;
        float delta = r1-x;
        vec2 target=uv1+delta*foward;
        vec2 target2 = target/size1;
        if(target2.x>0.0&&target2.x<1.0&&target2.y>0.0&&target2.y<1.0){
            float deep =( dot(pos1,foward)-(distance+minDistance-radius))/radius*.5+.5;
            
            gl_FragColor = texture2D(subtexture,target2);
            gl_FragColor = vec4(texture2D(subtexture,target2).xyz*deep,1.);
        }
    }
}
void showLayer4(vec2 uv){
    vec2 uv1=uv * size1;
    vec2 center = vec2(0.5, 0.5)*size1;
    vec2 pos1 =uv1-center;
    if(dot(pos1,foward)>distance+minDistance){

        float toCenter=dot(pos1,foward);
        float x=toCenter-distance-minDistance;
        float delta = -2.0*x-3.141592654*radius;

        vec2 target=uv1+delta*foward;
        vec2 target2 = target/size1;
        if(target2.x>0.0&&target2.x<1.0&&target2.y>0.0&&target2.y<1.0){
            gl_FragColor = texture2D(subtexture,target2);
        }
    }
}
void showScale(vec2 uv){
    // vec2 uv1=uv * size1;
    // vec2 center = vec2(0.5, 0.5)*size1;
    // vec2 pos1 =uv1-center;

    vec4 c =texture2D(texture, uv);
    float gray = dot(c.rgb, vec3(0.299 * 0.5, 0.587 * 0.5, 0.114 * 0.5));
    vec2 uuuv=uv+2.*moveAjustDistance*foward/size1;
    showLayer1(uuuv);
    if(uuuv.x>1.||uuuv.y>1.){
        gl_FragColor= vec4(0.0,0.0,0.0,0.0);
    }
    showLayer2(uuuv);
    showLayer3(uuuv);
    showLayer4(uuuv);
}
void main () {
    float temp;
    temp = dot(vec2(-0.5,-0.5)*size,foward);
    maxDistance= temp>maxDistance?temp:maxDistance;
    minDistance= temp<minDistance?temp:minDistance;

    temp = dot(vec2(0.5,-0.5)*size,foward);
    maxDistance= temp>maxDistance?temp:maxDistance;
    minDistance= temp<minDistance?temp:minDistance;

    temp = dot(vec2(-0.5,0.5)*size,foward);
    maxDistance= temp>maxDistance?temp:maxDistance;
    minDistance= temp<minDistance?temp:minDistance;

    temp = dot(vec2(0.5,0.5)*size,foward);
    maxDistance= temp>maxDistance?temp:maxDistance;
    minDistance= temp<minDistance?temp:minDistance;
    maxDistance=maxDistance/2.;
    minDistance=minDistance/2.;

     size1  = size/2.;
    showScale(uv0*2.);
}
`
const ShaderLab = {
    GrayScaling: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float gray = dot(c.rgb, vec3(0.299 * 0.5, 0.587 * 0.5, 0.114 * 0.5));
    gl_FragColor = vec4(gray, gray, gray, c.a * 0.5);
}
`
    },
    Stone: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float clrbright = (c.r + c.g + c.b) * (1. / 3.);
    float gray = (0.6) * clrbright;
    gl_FragColor = vec4(gray, gray, gray, c.a);
}
`
    },
    Ice: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 clrx = color * texture2D(texture, uv0);
    float brightness = (clrx.r + clrx.g + clrx.b) * (1. / 3.);
	float gray = (1.5)*brightness;
	clrx = vec4(gray, gray, gray, clrx.a)*vec4(0.8,1.2,1.5,1);
    gl_FragColor =clrx;
}
`
    },
    Frozen: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    c *= vec4(0.8, 1, 0.8, 1);
	c.b += c.a * 0.2;
    gl_FragColor = c;
}
`
    },
    Mirror: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    c.r *= 0.5;
    c.g *= 0.8;
    c.b += c.a * 0.2;
    gl_FragColor = c;
}
`
    },
    Poison: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    c.r *= 0.8;
	c.r += 0.08 * c.a;
	c.g *= 0.8;
    c.g += 0.2 * c.a;
	c.b *= 0.8;
    gl_FragColor = c;
}
`
    },
    Banish: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float gg = (c.r + c.g + c.b) * (1.0 / 3.0);
    c.r = gg * 0.9;
    c.g = gg * 1.2;
    c.b = gg * 0.8;
    c.a *= (gg + 0.1);
    gl_FragColor = c;
}
`
    },
    Vanish: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float gray = (c.r + c.g + c.b) * (1. / 3.);
    float rgb = gray * 0.8;
    gl_FragColor = vec4(rgb, rgb, rgb, c.a * (gray + 0.1));
}
`
    },
    Invisible: {
        vert: MVP,
        frag:
            `
void main () {
    gl_FragColor = vec4(0,0,0,0);
}
`
    },
    Blur: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
uniform float num;
varying vec2 uv0;
void main () {
    vec4 sum = vec4(0.0);
    vec2 size1 = vec2(num,num);
    sum += texture2D(texture, uv0 - 0.4 * size1) * 0.05;
	sum += texture2D(texture, uv0 - 0.3 * size1) * 0.09;
	sum += texture2D(texture, uv0 - 0.2 * size1) * 0.12;
	sum += texture2D(texture, uv0 - 0.1 * size1) * 0.15;
	sum += texture2D(texture, uv0             ) * 0.16;
	sum += texture2D(texture, uv0 + 0.1 * size1) * 0.15;
	sum += texture2D(texture, uv0 + 0.2 * size1) * 0.12;
	sum += texture2D(texture, uv0 + 0.3 * size1) * 0.09;
    sum += texture2D(texture, uv0 + 0.4 * size1) * 0.05;
    
    vec4 vectemp = vec4(0,0,0,0);
    vec4 substract = vec4(0,0,0,0);
    vectemp = (sum - substract) * color;

    float alpha = texture2D(texture, uv0).a;
    if(alpha < 0.05) { gl_FragColor = vec4(0 , 0 , 0 , 0); }
	else { gl_FragColor = vectemp; }
}
`
    },
    GaussBlur: {
        vert: MVP,
        frag:
            `
#define repeats 5.
uniform sampler2D texture;
uniform vec4 color;
uniform float num;
varying vec2 uv0;

vec4 draw(vec2 uv) {
    return color * texture2D(texture,uv).rgba; 
}
float grid(float var, float size1) {
    return floor(var*size1)/size1;
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main()
{
    vec4 blurred_image = vec4(0.);
    for (float i = 0.; i < repeats; i++) { 
        vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i,uv0.x+uv0.y))+num); 
        vec2 uv2 = uv0+(q*num);
        blurred_image += draw(uv2)/2.;
        q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i+2.,uv0.x+uv0.y+24.))+num); 
        uv2 = uv0+(q*num);
        blurred_image += draw(uv2)/2.;
    }
    blurred_image /= repeats;
    gl_FragColor = vec4(blurred_image);
}
`
    },
    Dissolve: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
uniform float time;
varying vec2 uv0;

void main()
{
    vec4 c = color * texture2D(texture,uv0);
    float height = c.r;
    if(height < time)
    {
        discard;
    }
    if(height < time+0.04)
    {
        // 溶解颜色，可以自定义
        c = vec4(.9,.6,0.3,c.a);
    }
    gl_FragColor = c;
}
`
    },
    Fluxay: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
uniform float time;
varying vec2 uv0;

void main()
{
    vec4 src_color = color * texture2D(texture, uv0).rgba;

    float width = 0.08;       //流光的宽度范围 (调整该值改变流光的宽度)
    float start = tan(time/1.414);  //流光的起始x坐标
    float strength = 0.008;   //流光增亮强度   (调整该值改变流光的增亮强度)
    float offset = 0.5;      //偏移值         (调整该值改变流光的倾斜程度)
    if(uv0.x < (start - offset * uv0.y) &&  uv0.x > (start - offset * uv0.y - width))
    {
        vec3 improve = strength * vec3(255, 255, 255);
        vec3 result = improve * vec3( src_color.r, src_color.g, src_color.b);
        gl_FragColor = vec4(result, src_color.a);

    }else{
        gl_FragColor = src_color;
    }
}
`
    },
    FluxaySuper: {
        vert: MVP,
        frag:
            `
#define TAU 6.12
#define MAX_ITER 5
uniform sampler2D texture;
uniform vec4 color;
uniform float time;
varying vec2 uv0;

void main()
{
    float time = time * .5+5.;
    // uv should be the 0-1 uv of texture...
    vec2 uv = uv0.xy;//fragCoord.xy / iResolution.xy;
    
    vec2 p = mod(uv*TAU, TAU)-250.0;

    vec2 i = vec2(p);
    float c = 1.0;
    float inten = .0045;

    for (int n = 0; n < MAX_ITER; n++) 
    {
        float t =  time * (1.0 - (3.5 / float(n+1)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(1.5*t + i.x));
        c += 1.0/length(vec2(p.x / (cos(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
    }
    c /= float(MAX_ITER);
    c = 1.17-pow(c, 1.4);
    vec4 tex = texture2D(texture,uv);
    vec3 colour = vec3(pow(abs(c), 20.0));
    colour = clamp(colour + vec3(0.0, 0.0, .0), 0.0, tex.a);

    // 混合波光
    float alpha = c*tex[3];  
    tex[0] = tex[0] + colour[0]*alpha; 
    tex[1] = tex[1] + colour[1]*alpha; 
    tex[2] = tex[2] + colour[2]*alpha; 
    gl_FragColor = color * tex;
}
`
    },
    Dark: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    float mix=2.0;
    vec4 black=vec4(0.0,0.0,0.0,1.0);
    vec4 c = color * texture2D(texture, uv0);
  
    gl_FragColor = (black*mix+c)/(1.0+mix);
}
`
    },
    Flip: {
        vert: MVP,
        frag: flipFrag,
        a: `
uniform sampler2D texture;
uniform sampler2D subtexture;
uniform vec2 foward;
uniform vec2 size;
uniform float radius;
uniform float distance;
uniform float moveAjustDistance;
varying vec2 uv0;

vec2 size1 =vec2(0.);
    float maxDistance = 0.0;
    float minDistance = 0.0;
void showLayer1(vec2 uv){
    vec2 uv1=uv * size1;
    vec2 center = vec2(0.5, 0.5)*size1;
    vec2 pos1 =uv1-center;


    if(dot(pos1,foward)>distance+minDistance){
        gl_FragColor = texture2D(texture, uv);
    }
}
void showLayer2(vec2 uv){
    vec2 uv1=uv * size1;
    vec2 center = vec2(0.5, 0.5)*size1;
    vec2 pos1 =uv1-center;

    if(dot(pos1,foward)>distance+minDistance-radius&&dot(pos1,foward)<distance+minDistance){
        float toCenter=dot(pos1,foward);
        float x=toCenter-distance-minDistance;
        float alpha=asin(x/radius);
        float r1=alpha*radius;
        float delta = r1-x;
        vec2 target=uv1+delta*foward;
        vec2 target2 = target/size1;
        if(target2.x>0.0&&target2.x<1.0&&target2.y>0.0&&target2.y<1.0){
            gl_FragColor = texture2D(texture,target2);
        }
    }
}
void showLayer3(vec2 uv){
    vec2 uv1=uv * size1;
    vec2 center = vec2(0.5, 0.5)*size1;
    vec2 pos1 =uv1-center;
    if(dot(pos1,foward)>distance+minDistance-radius&&dot(pos1,foward)<distance+minDistance){
        float toCenter=dot(pos1,foward);
        float x=toCenter-distance-minDistance;
        float alpha=asin(x/radius);
        float r1=-3.141592654*radius-alpha*radius;
        float delta = r1-x;
        vec2 target=uv1+delta*foward;
        vec2 target2 = target/size1;
        if(target2.x>0.0&&target2.x<1.0&&target2.y>0.0&&target2.y<1.0){
            float deep =( dot(pos1,foward)-(distance+minDistance-radius))/radius*.5+.5;
            
            gl_FragColor = texture2D(subtexture,target2);
            gl_FragColor = vec4(texture2D(subtexture,target2).xyz*deep,1.);
        }
    }
}
void showLayer4(vec2 uv){
    vec2 uv1=uv * size1;
    vec2 center = vec2(0.5, 0.5)*size1;
    vec2 pos1 =uv1-center;
    if(dot(pos1,foward)>distance+minDistance){

        float toCenter=dot(pos1,foward);
        float x=toCenter-distance-minDistance;
        float delta = -2.0*x-3.141592654*radius;

        vec2 target=uv1+delta*foward;
        vec2 target2 = target/size1;
        if(target2.x>0.0&&target2.x<1.0&&target2.y>0.0&&target2.y<1.0){
            gl_FragColor = texture2D(subtexture,target2);
        }
    }
}
void showScale(vec2 uv){
    // vec2 uv1=uv * size1;
    // vec2 center = vec2(0.5, 0.5)*size1;
    // vec2 pos1 =uv1-center;

    vec4 c =texture2D(texture, uv);
    float gray = dot(c.rgb, vec3(0.299 * 0.5, 0.587 * 0.5, 0.114 * 0.5));
    vec2 uuuv=uv+2.*moveAjustDistance*foward/size1;
    showLayer1(uuuv);
    if(uuuv.x>1.||uuuv.y>1.){
        gl_FragColor= vec4(0.0,0.0,0.0,0.0);
    }
    showLayer2(uuuv);
    showLayer3(uuuv);
    showLayer4(uuuv);
}
void main () {
    float temp;
    temp = dot(vec2(-0.5,-0.5)*size,foward);
    maxDistance= temp>maxDistance?temp:maxDistance;
    minDistance= temp<minDistance?temp:minDistance;

    temp = dot(vec2(0.5,-0.5)*size,foward);
    maxDistance= temp>maxDistance?temp:maxDistance;
    minDistance= temp<minDistance?temp:minDistance;

    temp = dot(vec2(-0.5,0.5)*size,foward);
    maxDistance= temp>maxDistance?temp:maxDistance;
    minDistance= temp<minDistance?temp:minDistance;

    temp = dot(vec2(0.5,0.5)*size,foward);
    maxDistance= temp>maxDistance?temp:maxDistance;
    minDistance= temp<minDistance?temp:minDistance;
    maxDistance=maxDistance/2.;
    minDistance=minDistance/2.;

     size1  = size/2.;
    showScale(uv0*2.);
}
`
    },

    ScaleFlip: {
        vert: MVP,
        frag: `
uniform sampler2D texture;
uniform sampler2D subtexture;
uniform vec2 foward;
uniform vec2 size;
uniform float radius;
uniform float distance;
uniform float moveAjustDistance;
varying vec2 uv0;

vec2 size1 =vec2(0.);
    float maxDistance = 0.0;
    float minDistance = 0.0;
    float scale=0.0;
void showLayer1(vec2 uv){
    vec2 uv1=uv * size1;
    vec2 center = vec2(0.5, 0.5)*size1;
    vec2 pos1 =uv1-center;

    if(dot(pos1,foward)>distance+minDistance){
        gl_FragColor = texture2D(texture, uv);
    }
}
void showLayer2(vec2 uv){
    vec2 uv1=uv * size1;
    vec2 center = vec2(0.5, 0.5)*size1;
    vec2 pos1 =uv1-center;

    if(dot(pos1,foward)>distance+minDistance-radius&&dot(pos1,foward)<distance+minDistance){
        float toCenter=dot(pos1,foward);
        float x=toCenter-distance-minDistance;
        float alpha=asin(x/radius);
        float r1=alpha*radius;
        float delta = r1-x;
        vec2 target=uv1+delta*foward;
        vec2 target2 = target/size1;
    
        // (20-2+2.*cos(alpha))/20
        vec2 target3 = (target2-vec2(.5,.5))*(1.-(1.-scale)/2.+(1.-scale)/2.*cos(alpha))+vec2(.5,.5);
        if(target3.x>0.0&&target3.x<1.0&&target3.y>0.0&&target3.y<1.0){
            gl_FragColor = texture2D(texture,target3);
        }
    }
}
void showLayer3(vec2 uv){
    vec2 uv1=uv * size1;
    vec2 center = vec2(0.5, 0.5)*size1;
    vec2 pos1 =uv1-center;
    if(dot(pos1,foward)>distance+minDistance-radius&&dot(pos1,foward)<distance+minDistance){
        float toCenter=dot(pos1,foward);
        float x=toCenter-distance-minDistance;
        float alpha=asin(x/radius);
        float r1=-3.141592654*radius-alpha*radius;
        float delta = r1-x;
        vec2 target=uv1+delta*foward;
        vec2 target2 = target/size1;

        vec2 target3 = (target2-vec2(.5,.5))*(1.-(1.-scale)/2.-(1.-scale)/2.*cos(alpha))+vec2(.5,.5);
        if(target3.x>0.0&&target3.x<1.0&&target3.y>0.0&&target3.y<1.0){
            float deep =( dot(pos1,foward)-(distance+minDistance-radius))/radius*.5+.5;
            
            gl_FragColor = texture2D(subtexture,target3);
            gl_FragColor = vec4(texture2D(subtexture,target3).xyz*deep,1.);
        }
    }
}
void showLayer4(vec2 uv){
    vec2 uv1=uv * size1;
    vec2 center = vec2(0.5, 0.5)*size1;
    vec2 pos1 =uv1-center;
    if(dot(pos1,foward)>distance+minDistance){

        float toCenter=dot(pos1,foward);
        float x=toCenter-distance-minDistance;
        float delta = -2.0*x-3.141592654*radius;

        vec2 target=uv1+delta*foward;
        vec2 target2 = target/size1;
        vec2 target3 = (target2-vec2(.5,.5))*scale+vec2(.5,.5);
        if(target3.x>0.0&&target3.x<1.0&&target3.y>0.0&&target3.y<1.0){
            gl_FragColor = texture2D(subtexture,target3);
        }
    }
}
void showScale(vec2 uv){
    // // vec2 uv1=uv * size1;
    // // vec2 center = vec2(0.5, 0.5)*size1;
    // // vec2 pos1 =uv1-center;
    // vec4 c =texture2D(texture, uv);

    // float gray = dot(c.rgb, vec3(0.299 * 0.5, 0.587 * 0.5, 0.114 * 0.5));
    vec2 uuuv=uv+2.*moveAjustDistance*foward/size1;
    showLayer1(uuuv);
    if(uuuv.x>1.||uuuv.x<0.||uuuv.y<0.||uuuv.y>1.){
        gl_FragColor= vec4(0.0,0.0,0.0,0.0);
    }
    showLayer2(uuuv);
    showLayer3(uuuv);
    showLayer4(uuuv);



}
void main () {
    float temp;
     scale = 0.8;

    temp = dot(vec2(-0.5,-0.5)*size,foward);
    maxDistance= temp>maxDistance?temp:maxDistance;
    minDistance= temp<minDistance?temp:minDistance;

    temp = dot(vec2(0.5,-0.5)*size,foward);
    maxDistance= temp>maxDistance?temp:maxDistance;
    minDistance= temp<minDistance?temp:minDistance;

    temp = dot(vec2(-0.5,0.5)*size,foward);
    maxDistance= temp>maxDistance?temp:maxDistance;
    minDistance= temp<minDistance?temp:minDistance;

    temp = dot(vec2(0.5,0.5)*size,foward);
    maxDistance= temp>maxDistance?temp:maxDistance;
    minDistance= temp<minDistance?temp:minDistance;
    maxDistance=maxDistance*scale;
    minDistance=minDistance*scale;

     size1  = size*scale;
    showScale((uv0-vec2(.5-.5*scale,.5-.5*scale))/scale);
    // gl_FragColor=texture2D(subtexture,uv0);
    

}
`,
    },

    ColorMask: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    gl_FragColor=vec4(color.xyz,texture2D(texture, uv0).w);
}
`
    },
    RBG: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    gl_FragColor=texture2D(texture, uv0).rbga;
}
`
    },
    BGR: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    gl_FragColor=texture2D(texture, uv0).bgra;
}
`
    },
    BRG: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    gl_FragColor=texture2D(texture, uv0).brga;
}
`
    },
    GBR: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    gl_FragColor=texture2D(texture, uv0).gbra;
}
`
    },
    GRB: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    gl_FragColor=texture2D(texture, uv0).grba;
}
`
    },

    HorizonalReelFall: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

// uniform vec2 archor;
 float maxRadius;
 float camereRadius;
 float alpha;

vec2 getXY(float a ,vec2 v){

    float s_arcX=alpha*maxRadius;
    float s_sinX=sin(alpha)*maxRadius;

    float sinX=s_sinX+v.x;
    float angular = asin(sinX/maxRadius);
    float arcX=angular*maxRadius;
    
    float x = arcX-s_arcX;
    float y = cos(angular)*v.y*0.39;

    
    return vec2(x,y);
}
void main () {

    vec2 archor=vec2(0.5,0.5);
    vec2 v= uv0-archor;
    maxRadius=0.3;
    camereRadius=2.;
    alpha=0.0;

    vec2 target = uv0+getXY(alpha,v);
    float maxArcLen=maxRadius*acos(camereRadius/maxRadius);
    gl_FragColor=vec4(0.0);
    if(target.x >0.0&&target.x<1.0  && target.y>0.0&&target.y<1.0){
        gl_FragColor =    texture2D(texture, target);

    }

}
`
    },

    HorizonalReelRise: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

 float maxRadius;
 float camereRadius;
 float alpha;

vec2 getXY(float a ,vec2 v){

    float s_arcX=a*maxRadius;
    float s_sinX=sin(a)*maxRadius;

    float sinX=s_sinX+v.x;
    float angular = asin(sinX/maxRadius);
    float arcX=angular*maxRadius;
    
    float x = arcX-s_arcX;
    float y = (1.0-cos(angular))*v.y*1.39;
    
    return vec2(x,y);
}
void main () {

    vec2 archor=vec2(0.5,0.5);
    vec2 v= uv0-archor;
    maxRadius=0.3;
    camereRadius=2.;
    alpha=0.0;
    vec2 target = uv0+getXY(alpha,v);
    // float maxArcLen=maxRadius*acos(camereRadius/maxRadius);
    gl_FragColor=vec4(0.0);
    if(target.x >0.0&&target.x<1.0  && target.y>0.0&&target.y<1.0){
        gl_FragColor =    texture2D(texture, target);
    }
}
`
    },
    VerticalReelFall: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

// uniform vec2 archor;
 float maxRadius;
 float camereRadius;
 uniform float alpha;

vec2 getXY(float a ,vec2 v){

    float s_arcY=alpha*maxRadius;
    float s_sinY=sin(alpha)*maxRadius;

    float sinY=s_sinY+v.y;
    float angular = asin(sinY/maxRadius);
    float arcY=angular*maxRadius;
    
    float y = arcY-s_arcY;
    float x = cos(angular)*v.x*1.39;

    
    return vec2(x,y);
}
void main () {

    vec2 archor=vec2(0.5,0.5);
    vec2 v= uv0-archor;
    maxRadius=1.4502;
    camereRadius=2.;
    // alpha=0.0;

    vec2 target = uv0+getXY(alpha,v);
    float maxArcLen=maxRadius*acos(camereRadius/maxRadius);
    gl_FragColor=vec4(0.0);
    if(target.x >0.0&&target.x<1.0  && target.y>0.0&&target.y<1.0){
        gl_FragColor =    texture2D(texture, target);

    }

}
`
    },
    VerticalReelRise: {
        vert: MVP,
        frag:
            `
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

 float maxRadius;
 float camereRadius;
 uniform float alpha;

vec2 getXY(float a ,vec2 v){

    float s_arcX=a*maxRadius;
    float s_sinX=sin(a)*maxRadius;

    float sinX=s_sinX+v.y;
    float angular = asin(sinX/maxRadius);
    float arcX=angular*maxRadius;
    
    float x = arcX-s_arcX;
    float y = (1.0-cos(angular))*v.x*1.39;
    
    return vec2(y,x);
}
void main () {

    vec2 archor=vec2(0.5,0.5);
    vec2 v= uv0-archor;
    //--- 虚拟圆周半径，一个图标边长为1
    maxRadius=1.4502;
    // alpha=0.0;
    vec2 target = uv0+getXY(alpha,v);
    gl_FragColor=vec4(0.0);
    if(target.x >0.0&&target.x<1.0  && target.y>0.0&&target.y<1.0){
        gl_FragColor =    texture2D(texture, target);
    }
}
`
    },
    Flip0: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip1: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip2: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip3: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip3: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip4: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip5: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip6: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip7: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip8: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip9: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip10: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip11: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip12: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip13: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip14: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip15: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip16: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip17: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip18: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip19: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip20: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip21: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip22: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip23: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip24: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip25: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip26: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip27: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip28: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip29: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip30: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip31: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip32: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip33: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip34: {
        vert: MVP,
        frag: flipFrag,
    },
    Flip35: {
        vert: MVP,
        frag: flipFrag,
    },


};

module.exports = ShaderLab;
