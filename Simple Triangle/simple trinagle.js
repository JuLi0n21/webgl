//shader
var vertexShaderText = 
`precision mediump float; 
attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;
void main() {   fragColor = vertColor;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
} ` 

//fragmentshader
var fragmentShaderText = 
`precision mediump float;
varying vec3 fragColor;
void main() {
  
    gl_FragColor = vec4(fragColor, 1.0);
}` 


//Intilasing open webgl and canvas
var InitDemo = function () {
    console.log('Working FIne!');

    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');

    if(!gl) {
        console.log('experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }
    
    if(!gl) {
        alert("Your browser does not Support WebGL");
    }

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //
    // create Shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);    
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERROR LINKING program", gl.getProgramInfoLog(program))
        return;
    }

    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("ERROR validating program!", gl.getProgramInfoLog(program));
        return;
    }

    //
    //Create buffer
    //
    var triangleVertices =
    [ //X,      Y,      R,      G,     B,
        0.0,    0.5,    1.0,    0,     0,
        -0.5,   -0.5,   0,      1.0,   0,
        0.5,    -0.5,   0,      0,     1.0
    ];

    var triangleVertextBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertextBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation, //Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, //Type of elements
        gl.FLASE, //If data is normalised
        5 * Float32Array.BYTES_PER_ELEMENT,// Size of an individual vertex
        0 //offset aform the befinning of a single vertex to this attribute
    );

    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLocation, //Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, //Type of elements
        gl.FLASE, //If data is normalised
        5 * Float32Array.BYTES_PER_ELEMENT,// Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT //offset aform the befinning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation)
    gl.enableVertexAttribArray(colorAttribLocation);

    //
    //Main render loop
    //
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};