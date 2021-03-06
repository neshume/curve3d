/**
 * Cache references to Math API functions for speed.
 * NOTE: I ran a pile of benchmarks comparing these functions against many inline abs hacks with bitwise math, etc.
 * Surprisingly, a cached reference to Math.abs was faster than  (x < 0 ? -x : x) and (x ^ (x >> 31)) - (x >> 31)) in all modern browsers.
 * 
 * @constructor
 */
c3d.MathClass = function() {
	this.abs = Math.abs;
	this.sqrt = Math.sqrt;
	this.cos = Math.cos;
	this.sin = Math.sin;
	this.tan = Math.tan;
	this.PI = Math.PI;
};

/**
 * Where appropriate, all math operations are applied inline to the left-hand object.
 * This requires a little more boilerplate code, but can significantly cut down on object creation
 * by allowing manual memory management (such as allocation pools).
 *
 * NOTE: I ran a pile of benchmarks comparing the use of .xyz properties vs. an array of elements.
 * In all modern browsers, the .xyz properties were at least twice as fast.
 * 
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @constructor
 * @extends {c3d.MathClass}
 */
c3d.Vec3 = function(x, y, z) {
	c3d.MathClass.call(this);
	this.x = x || 0.0;
	this.y = y || 0.0;
	this.z = z || 0.0;
};
c3d.inherits(c3d.Vec3, c3d.MathClass);

c3d.Vec3.prototype.ident = function() {
	this.x = 1.0; this.y = 1.0; this.z = 1.0;
	return this;
};
c3d.Vec3.prototype.zero = function() {
	this.x = 0.0; this.y = 0.0; this.z = 0.0;
	return this;
};
c3d.Vec3.prototype.clone = function() {
	return new c3d.Vec3(this.x, this.y, this.z);
};
c3d.Vec3.prototype.set = function(v) {
	this.x = v.x; this.y = v.y; this.z = v.z;
	
	return this;
};

// Scalar operations
c3d.Vec3.prototype.mul = function(s) {
	this.x *= s; this.y *= s; this.z *= s;
	return this;
};
c3d.Vec3.prototype.div = function(s) {
	s = 1/s;
	this.x *= s; this.y *= s; this.z *= s;
	return this;
};
c3d.Vec3.prototype.neg = function() {
	this.x = -this.x; this.y = -this.y; this.z = -this.z;
	return this;
};

// Vector operations
c3d.Vec3.prototype.add = function(v) {
	this.x += v.x; this.y += v.y; this.z += v.z;
	return this;
};
c3d.Vec3.prototype.sub = function(v) {
	this.x -= v.x; this.y -= v.y; this.z -= v.z;
	return this;
};
c3d.Vec3.prototype.dot = function(v) {
	return this.x*v.x + this.y*v.y + this.z*v.z;
};
c3d.Vec3.prototype.cross = function(v) {
	this.x = this.y*v.z - this.z*v.y;
	this.y = this.z*v.x - this.x*v.z;
	this.z = this.x*v.y - this.y*v.x;
	return this;
};

// Miscellaneous

c3d.Vec3.prototype.len = function() {
	return this.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
};
c3d.Vec3.prototype.len2 = function() {
	return this.x*this.x + this.y*this.y + this.z*this.z;
};
c3d.Vec3.prototype.norm = function() {
	var l = this.len();
	this.div(l);
	return this;
};

c3d.Vec3.prototype.eq = function(v) {
	return ((this.abs(this.x - v.x) < 0) && (this.abs(this.y - v.y) < 0) && (this.abs(this.z - v.z) < 0));
};

c3d.Vec3.prototype.dist = function(v) {
	var dx = v.x - this.x, dy = v.y - this.y, dz = v.z - this.z;
	return this.sqrt(dx*dx + dy*dy + dz*dz);
};
c3d.Vec3.prototype.dist2 = function(v) {
	var dx = v.x - this.x, dy = v.y - this.y, dz = v.z - this.z;
	return dx*dx + dy*dy + dz*dz;
};
c3d.Vec3.prototype.dist2d = function(v) {
	var dx = v.x - this.x, dy = v.y - this.y;
	return this.sqrt(dx*dx + dy*dy);
};
c3d.Vec3.prototype.dist2d2 = function(v) {
	var dx = v.x - this.x, dy = v.y - this.y;
	return dx*dx + dy*dy;
};

c3d.Vec3.prototype.trans = function(m, v) {
	var vx = v.x, vy = v.y, vz = v.z;
	
	this.x = m._11*vx + m._12*vy + m._13*vz + m._14;
	this.y = m._21*vx + m._22*vy + m._23*vz + m._24;
	this.z = m._31*vx + m._32*vy + m._33*vz + m._34;
	
	return this;
};

// Pretty darn slow function, but it should only be used in debugging anyway.
c3d.Vec3.prototype.toString = function() {
	return 'vec3: (' + this.x + ',' + this.y + ',' + this.z + ')';
};

/** @const */ c3d.X = new c3d.Vec3(1.0, 0.0, 0.0);
/** @const */ c3d.Y = new c3d.Vec3(0.0, 1.0, 0.0);
/** @const */ c3d.Z = new c3d.Vec3(0.0, 0.0, 1.0);

/** @const */ c3d.NX = new c3d.Vec3(-1.0, 0.0, 0.0);
/** @const */ c3d.NY = new c3d.Vec3(0.0, -1.0, 0.0);
/** @const */ c3d.NZ = new c3d.Vec3(0.0, 0.0, -1.0);

/** @const */ c3d.Vec3.ZERO = new c3d.Vec3();

/**
 * @param {number} x
 * @param {number} y
 * @constructor
 * @extends {c3d.MathClass}
 */
c3d.Vec2 = function(x, y) {
	c3d.MathClass.call(this);
	this.x = x || 0.0;
	this.y = y || 0.0;
};
c3d.inherits(c3d.Vec2, c3d.MathClass);
	
c3d.Vec2.prototype.ident = function() {
	this.x = 1.0; this.y = 1.0;
};
c3d.Vec2.prototype.zero = function() {
	this.x = 0.0; this.y = 0.0;
};
c3d.Vec2.prototype.clone = function() {
	return new c3d.Vec2(this.x, this.y);
};
c3d.Vec2.prototype.set = function(v) {
	this.x = v.x; this.y = v.y;
	
	return this;
};

// Scalar operations
c3d.Vec2.prototype.mul = function(s) {
	this.x *= s; this.y *= s;
};
c3d.Vec2.prototype.div = function(s) {
	s = 1.0/s;
	this.x *= s; this.y *= s;
};

// Vector operations
c3d.Vec2.prototype.add = function(v) {
	this.x += v.x; this.y += v.y;
	return this;
};
c3d.Vec2.prototype.sub = function(v) {
	this.x -= v.x; this.y -= v.y;
	return this;
};
c3d.Vec2.prototype.dot = function(v) {
	return this.x*v.x + this.y*v.y;
};

c3d.Vec2.prototype.dist = function(v) {
	var dx = v.x - this.x, dy = v.y - this.y;
	return this.sqrt(dx*dx + dy*dy);
};
c3d.Vec2.prototype.dist2 = function(v) {
	var dx = v.x - this.x, dy = v.y - this.y;
	return dx*dx + dy*dy;
};

// Miscellaneous

c3d.Vec2.prototype.len = function() {
	return this.sqrt(this.x*this.x + this.y*this.y);
};
c3d.Vec2.prototype.len2 = function() {
	return this.x*this.x + this.y*this.y;
};
c3d.Vec2.prototype.norm = function() {
	var l = this.len();
	this.div(l);
};

c3d.Vec2.prototype.eq = function(v) {
	return ((this.abs(this.x - v.x) < 0) && (this.abs(this.y - v.y) < 0));
};
c3d.Vec2.prototype.trans = function(m, v) {
	var vx = v.x, vy = v.y;
	
	this.x = m._11*vx + m._21*vy + m._13;
	this.y = m._12*vx + m._22*vy + m._23;
	
	return this;
};
c3d.Vec2.prototype.trans2 = function(m, v) {
	var vx = v.x, vy = v.y;
	
	this.x = m._11*vx + m._21*vy;
	this.y = m._12*vx + m._22*vy;
	
	return this;
};

// Pretty darn slow function, but it should only be used in debugging anyway.
c3d.Vec2.prototype.toString = function() {
	return 'vec2: (' + this.x + ',' + this.y + ')';
};

/**
 * @constructor
 * @extends {c3d.MathClass}
 */
c3d.Quat = function() {
	c3d.MathClass.call(this);
	this.ident();	// this should get inlined by the compiler
};
c3d.inherits(c3d.Quat, c3d.MathClass);
	
c3d.Quat.prototype.ident = function() {
	this.x = 0.0; this.y = 0.0; this.z = 0.0; this.w = 1.0;
};
c3d.Quat.prototype.zero = function() {
	this.x = 0.0; this.y = 0.0; this.z = 0.0; this.w = 0.0;
};

// Rotation about an axis vector v by angle a
c3d.Quat.prototype.fromRotAxis = function(v, a) {
	var halfA = a*0.5;
	var cosA = this.cos(halfA), sinA = this.sin(halfA);

	this.x = v.x*sinA; this.y = v.y*sinA; this.z = v.z*sinA; this.w = cosA;
	
	this.norm();
};

c3d.Quat.prototype.len = function() {
	return this.sqrt(this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w);
};
c3d.Quat.prototype.len2 = function() {
	return this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w;
};
c3d.Quat.prototype.norm = function() {
	var l = this.len();
	l = 1.0/l;
	this.x *= l; this.y *= l; this.z *= l; this.w *= l;
	
	return this;
};

c3d.Quat.prototype.mulq = function(q1, q2) {
	var x1 = q1.x, y1 = q1.y, z1 = q1.z, w1 = q1.w;
	var x2 = q2.x, y2 = q2.y, z2 = q2.z, w2 = q2.w;

	this.x = w1*x2 + x1*w2 + y1*z2 - z1*y2;
	this.y = w1*y2 + y1*w2 + z1*x2 - x1*z2;
	this.z = w1*z2 + z1*w2 + x1*y2 - y1*x2;
	this.w = w1*w2 - x1*x2 - y1*y2 - z1*z2;
};
c3d.Quat.prototype.mul = function(q2) {
	var x1 = this.x, y1 = this.y, z1 = this.z, w1 = this.w;
	var x2 = q2.x, y2 = q2.y, z2 = q2.z, w2 = q2.w;

	this.x = w1*x2 + x1*w2 + y1*z2 - z1*y2;
	this.y = w1*y2 + y1*w2 + z1*x2 - x1*z2;
	this.z = w1*z2 + z1*w2 + x1*y2 - y1*x2;
	this.w = w1*w2 - x1*x2 - y1*y2 - z1*z2;
};

/**
 * @constructor
 * @extends {c3d.MathClass}
 */
c3d.Rect = function(x, y, w, h) {
	c3d.MathClass.call(this);
	
	this.x = x || 0; this.y = y || 0; this.w = w || 0; this.h = h || 0;
};
c3d.inherits(c3d.Rect, c3d.MathClass);

/**
 * NOTE: I ran a pile of benchmarks comparing instance scratch variables to local scratch variables to no scratch variables.
 * local scratch variables were fastest in all modern browsers.
 * 
 * @constructor
 * @extends {c3d.MathClass}
 */
c3d.Mat4 = function() {
	c3d.MathClass.call(this);
	this.ident();	// this should get inlined by the compiler
	this.els = [this._11, this._12, this._13, this._14,
		        this._21, this._22, this._23, this._24,
				this._31, this._32, this._33, this._34,
				this._41, this._42, this._43, this._44];
};
c3d.inherits(c3d.Mat4, c3d.MathClass);
	
c3d.Mat4.prototype.ident = function() {
	this._11 = 1.0; this._12 = 0.0; this._13 = 0.0; this._14 = 0.0;
	this._21 = 0.0; this._22 = 1.0; this._23 = 0.0; this._24 = 0.0;
	this._31 = 0.0; this._32 = 0.0; this._33 = 1.0; this._34 = 0.0;
	this._41 = 0.0; this._42 = 0.0; this._43 = 0.0; this._44 = 1.0;
};
c3d.Mat4.prototype.zero = function() {
	this._11 = this._12 = this._13 = this._14 =
	this._21 = this._22 = this._23 = this._24 =
	this._31 = this._32 = this._33 = this._34 =
	this._41 = this._42 = this._43 = this._44 = 0.0;
};

// TODO: This could use some optimization probably
c3d.Mat4.prototype.fromArray = function(el) {
	c3d.setupMap(this, this.els, el);
};

c3d.Mat4.prototype.det3 = function() {
	var m11 = this._11, m12 = this._12, m13 = this._13,
	    m21 = this._21, m22 = this._22, m23 = this._23,
	    m31 = this._31, m32 = this._32, m33 = this._33;
	
	return (m11*m22 - m21*m12)*m33
	     - (m11*m32 - m31*m12)*m23
	     + (m21*m32 - m31*m22)*m13;
};
c3d.Mat4.prototype.det4 = function() {
	var m11 = this._11, m12 = this._12, m13 = this._13, m14 = this._14,
	    m21 = this._21, m22 = this._22, m23 = this._23, m24 = this._24,
	    m31 = this._31, m32 = this._32, m33 = this._33, m34 = this._34,
	    m41 = this._41, m42 = this._42, m43 = this._43, m44 = this._44;
	
	return (m11*m22 - m21*m12)*(m33*m44 - m43*m34)
		 - (m11*m32 - m31*m12)*(m23*m44 - m43*m24)
		 + (m11*m42 - m41*m12)*(m23*m34 - m33*m24)
		 + (m21*m32 - m31*m22)*(m13*m44 - m43*m14)
		 - (m21*m42 - m41*m22)*(m13*m34 - m33*m14)
		 + (m31*m42 - m41*m32)*(m13*m24 - m23*m14);
};

c3d.Mat4.prototype.inv3m = function(m) {
	var d = this.det3();
	if (this.abs(d) < 0.0001) return;
	
	d = 1.0/d;

	var m11 = m._11, m12 = m._12, m13 = m._13, m14 = m._14,
	    m21 = m._21, m22 = m._22, m23 = m._23, m24 = m._24,
	    m31 = m._31, m32 = m._32, m33 = m._33, m34 = m._34;
	
	this._11 =  d*(m22*m33 - m32*m23),
	this._12 = -d*(m12*m33 - m32*m13),
	this._13 =  d*(m12*m23 - m22*m13),
	this._14 = -d*(m12*(m23*m34 - m33*m24) - m22*(m13*m34 - m33*m14) + m32*(m13*m24 - m23*m14)),
	this._21 = -d*(m21*m33 - m31*m23),
	this._22 =  d*(m11*m33 - m31*m13),
	this._23 = -d*(m11*m23 - m21*m13),
	this._24 =  d*(m11*(m23*m34 - m33*m24) - m21 * (m13*m34 - m33*m14) + m31 * (m13*m24 - m23*m14)),
	this._31 =  d*(m21*m32 - m31*m22),
	this._32 = -d*(m11*m32 - m31*m12),
	this._33 =  d*(m11*m22 - m21*m12),
	this._34 = -d*(m11*(m22*m34 - m32*m24) - m21 * (m12*m34 - m32*m14) + m31 * (m12*m24 - m22*m14));
};
c3d.Mat4.prototype.inv3 = function() {
	this.inv3m(this);
};

// m1*m2, apply to self
c3d.Mat4.prototype.mul3m = function(m1, m2) {
	var m111 = m1._11, m112 = m1._12, m113 = m1._13,
	    m121 = m1._21, m122 = m1._22, m123 = m1._23,
	    m131 = m1._31, m132 = m1._32, m133 = m1._33;
	
	var m211 = m2._11, m212 = m2._12, m213 = m2._13,
	    m221 = m2._21, m222 = m2._22, m223 = m2._23,
	    m231 = m2._31, m232 = m2._32, m233 = m2._33;
	
	this._11 = m111*m211 + m112*m221 + m113*m231;
	this._12 = m111*m212 + m112*m222 + m113*m232;
	this._13 = m111*m213 + m112*m223 + m113*m233;

	this._21 = m121*m211 + m122*m221 + m123*m231;
	this._22 = m121*m212 + m122*m222 + m123*m232;
	this._23 = m121*m213 + m122*m223 + m123*m233;

	this._31 = m131*m211 + m132*m221 + m133*m231;
	this._32 = m131*m212 + m132*m222 + m133*m232;
	this._33 = m131*m213 + m132*m223 + m133*m233;
	
	this._41 = m1._41;
	this._42 = m1._42;
	this._43 = m1._43;
};
// Times-equals, apply to self
c3d.Mat4.prototype.mul3 = function(m2) {
	var m111 = this._11, m112 = this._12, m113 = this._13,
	    m121 = this._21, m122 = this._22, m123 = this._23,
	    m131 = this._31, m132 = this._22, m133 = this._33;
	
	var m211 = m2._11, m212 = m2._12, m213 = m2._13,
	    m221 = m2._21, m222 = m2._22, m223 = m2._23,
	    m231 = m2._31, m232 = m2._22, m233 = m2._33;
	
	this._11 = m111*m211 + m112*m221 + m113*m231;
	this._12 = m111*m212 + m112*m222 + m113*m232;
	this._13 = m111*m213 + m112*m223 + m113*m233;

	this._21 = m121*m211 + m122*m221 + m123*m231;
	this._22 = m121*m212 + m122*m222 + m123*m232;
	this._23 = m121*m213 + m122*m223 + m123*m233;

	this._31 = m131*m211 + m132*m221 + m133*m231;
	this._32 = m131*m212 + m132*m222 + m133*m232;
	this._33 = m131*m213 + m132*m223 + m133*m233;
};

c3d.Mat4.prototype.mulm = function(m1, m2) {
	var m111 = m1._11, m112 = m1._12, m113 = m1._13, m114 = m1._14,
	    m121 = m1._21, m122 = m1._22, m123 = m1._23, m124 = m1._24,
	    m131 = m1._31, m132 = m1._32, m133 = m1._33, m134 = m1._34;
	
	var m211 = m2._11, m212 = m2._12, m213 = m2._13, m214 = m2._14,
	    m221 = m2._21, m222 = m2._22, m223 = m2._23, m224 = m2._24,
	    m231 = m2._31, m232 = m2._32, m233 = m2._33, m234 = m2._34;
	
	this._11 = m111*m211 + m112*m221 + m113*m231;
	this._12 = m111*m212 + m112*m222 + m113*m232;
	this._13 = m111*m213 + m112*m223 + m113*m233;
	this._14 = m111*m214 + m112*m224 + m113*m234 + m114;

	this._21 = m121*m211 + m122*m221 + m123*m231;
	this._22 = m121*m212 + m122*m222 + m123*m232;
	this._23 = m121*m213 + m122*m223 + m123*m233;
	this._24 = m121*m214 + m122*m224 + m123*m234 + m124;

	this._31 = m131*m211 + m132*m221 + m133*m231;
	this._32 = m131*m212 + m132*m222 + m133*m232;
	this._33 = m131*m213 + m132*m223 + m133*m233;
	this._34 = m131*m214 + m132*m224 + m133*m234 + m134;
};
c3d.Mat4.prototype.mul = function(m2) {

};

c3d.Mat4.prototype.scale = function(sx, sy, sz) {
	if (sx) this._11 *= sx; this._12 *= sx; this._13 *= sx;
	if (sy) this._21 *= sy; this._22 *= sy; this._23 *= sy;
	if (sz) this._31 *= sz; this._32 *= sz; this._33 *= sz;
};
c3d.Mat4.prototype.scalev = function(v) {
	var sx = v.x, sy = v.y, sz = v.z;
	this._11 *= sx; this._12 *= sx; this._13 *= sx;
	this._21 *= sy; this._22 *= sy; this._23 *= sy;
	this._31 *= sz; this._32 *= sz; this._33 *= sz;
};
// NOTE: The following functions are very expensive, don't use them if you can help it
c3d.Mat4.prototype.scaleX = function() {
	return this.sqrt(this._11*this._11 + this._12*this._12 + this._13*this._13);
};
c3d.Mat4.prototype.scaleY = function() {
	return this.sqrt(this._21*this._21 + this._22*this._22 + this._23*this._23);
};
c3d.Mat4.prototype.scaleZ = function() {
	return this.sqrt(this._31*this._31 + this._32*this._32 + this._33*this._33);
};

c3d.Mat4.prototype.moveTo = function(x, y, z) {
	this._14 = x; this._24 = y; this._34 = z;
};
c3d.Mat4.prototype.moveBy = function(x, y, z) {
	this._14 += x; this._24 += y; this._34 += z;
};
c3d.Mat4.prototype.moveToV = function(v) {
	this._14 = v.x; this._24 = v.y; this._34 = v.z;
};
c3d.Mat4.prototype.moveByV = function(v) {
	this._14 += v.x; this._24 += v.y; this._34 += v.z;
};

c3d.Mat4.prototype.perspective = function(aspRatio, fov, nearZ, farZ) {
	var fovRad = fov*0.5*this.PI/180.0;
	var tanFov = Math.tan(fovRad);
	var invTan = 1.0/tanFov;
	
	var zTot = nearZ + farZ, zDiff = nearZ - farZ;
	var invZDiff = 1.0/zDiff;
	
	this._12 = this._13 = this._14 =
	this._21 = this._23 = this._24 =
	this._31 = this._32 = 
	this._41 = this._42 = this._44 = 0;
	
	this._11 = invTan/aspRatio;
	this._22 = invTan;
	
	this._33 = -zTot*invZDiff;
	this._34 = 2.0*farZ*nearZ*invZDiff;
	this._43 = 1;
};

// Build a 3x3 rotation matrix, rotate angle a about vector v
c3d.Mat4.prototype.fromRotAxis = function(v, a) {
	var vx = v.x, vy = v.y, vz = v.z;
	var cosA = this.cos(a), sinA = this.sin(a);
	var cosIA = 1.0 - cosA;
	
	var rxy = vx*vy*cosIA, 
	    ryz = vy*vz*cosIA,
	    rxz = vx*vz*cosIA;
	
	var rx = sinA*vx,
	    ry = sinA*vy,
		rz = sinA*vz;
	
	this._11 = cosA + vx*vx*cosIA;
	this._12 = rxy - rz;
	this._13 = rxz + ry;
	
	this._21 = rxy + rz;
	this._22 = cosA + vy*vy*cosIA;
	this._23 = ryz - rx;
	
	this._31 = rxz - ry;
	this._32 = ryz + rx;
	this._33 = cosA + vz*vz*cosIA;
};

c3d.Mat4.prototype.fromQuat = function(q) {
	var x = q.x, y = q.y, z = q.z, w = q.w;
	
	var xx = x*x, xy = x*y, xz = x*z, xw = x*w
	            , yy = y*y, yz = y*z, yw = y*w
				          , zz = z*z, zw = z*w;
	
	this._11 = 1.0 - (yy + zz)*2.0;
	this._12 =       (xy - zw)*2.0;
	this._13 =       (xz + yw)*2.0;

	this._21 =       (xy + zw)*2.0;
	this._22 = 1.0 - (xx + zz)*2.0;
	this._23 =       (yz - xw)*2.0;

	this._31 =       (xz - yw)*2.0;
	this._32 =       (yz + xw)*2.0;
	this._33 = 1.0 - (xx + yy)*2.0;
};

c3d.Mat4.prototype.pos = function() {
	return new c3d.Vec3(this._14, this._24, this._34);
};

// Pretty darn slow function, but it should only be used in debugging anyway.
c3d.Mat4.prototype.toString = function() {
	return 'mat4: [' +
	'[' + [this._11, this._12, this._13, this._14].join(',') + '],' +
	'[' + [this._21, this._22, this._23, this._24].join(',') + '],' +
	'[' + [this._31, this._32, this._33, this._34].join(',') + '],' +
	'[' + [this._41, this._42, this._43, this._44].join(',') +
	']]';
};

/**
 * @constructor
 * @extends {c3d.MathClass}
 */
c3d.Mat3 = function() {
	c3d.MathClass.call(this);
	this.ident();	// this should get inlined by the compiler
	this.els = [this._11, this._12, this._13,
		        this._21, this._22, this._23,
				this._31, this._32, this._33];
};
c3d.inherits(c3d.Mat3, c3d.MathClass);

c3d.Mat3.prototype.ident = function() {
	this._11 = 1.0; this._12 = 0.0; this._13 = 0.0;
	this._21 = 0.0; this._22 = 1.0; this._23 = 0.0;
	this._31 = 0.0; this._32 = 0.0; this._33 = 1.0;
};
c3d.Mat3.prototype.zero = function() {
	this._11 = this._12 = this._13 =
	this._21 = this._22 = this._23 =
	this._31 = this._32 = this._33 = 0.0;
};

// TODO: This could use some optimization probably
c3d.Mat3.prototype.fromArray = function(el) {
	c3d.setupMap(this, this.els, el);
};
c3d.Mat3.prototype.fromVec3Rows = function(v1, v2, v3) {
	this._11 = v1.x; this._12 = v1.y; this._13 = v1.z;
	this._21 = v2.x; this._22 = v2.y; this._23 = v2.z;
	this._31 = v3.x; this._32 = v3.y; this._33 = v3.z;
};
c3d.Mat3.prototype.fromVec3Cols = function(v1, v2, v3) {
	this._11 = v1.x; this._12 = v2.x; this._13 = v3.x;
	this._21 = v1.y; this._22 = v2.y; this._23 = v3.y;
	this._31 = v1.z; this._32 = v2.z; this._33 = v3.z;
};

c3d.Mat3.prototype.det = function() {
	var m11 = this._11, m12 = this._12, m13 = this._13,
	    m21 = this._21, m22 = this._22, m23 = this._23,
	    m31 = this._31, m32 = this._32, m33 = this._33;
	
	return m11*(m22*m33 - m23*m32)
	     + m12*(m23*m31 - m21*m33)
		 + m13*(m21*m32 - m22*m31);
};
// TODO: Optimize this by avoiding the det() call: dont duplicate multiplies
c3d.Mat3.prototype.invm = function(m) {
	var d = m.det();
	if (this.abs(d) < 0.0001) return null;
	
	d = 1.0/d;

	var m11 = m._11, m12 = m._12, m13 = m._13,
	    m21 = m._21, m22 = m._22, m23 = m._23,
	    m31 = m._31, m32 = m._32, m33 = m._33;
	
	this._11 = d*(m22*m33 - m23*m32);
	this._12 = d*(m32*m13 - m12*m33);
	this._13 = d*(m12*m23 - m22*m13);
	this._21 = d*(m23*m31 - m21*m33);
	this._22 = d*(m11*m33 - m31*m13);
	this._23 = d*(m21*m13 - m11*m23);
	this._31 = d*(m21*m32 - m22*m31);
	this._32 = d*(m31*m12 - m11*m32);
	this._33 = d*(m11*m22 - m21*m12);
	
	return this;
};
c3d.Mat3.prototype.inv = function() {
	return this.invm(this);
};

// m1*m2, apply to self
c3d.Mat3.prototype.mul2m = function(m1, m2) {
	var m111 = m1._11, m112 = m1._12,
	    m121 = m1._21, m122 = m1._22;
	
	var m211 = m2._11, m212 = m2._12,
	    m221 = m2._21, m222 = m2._22;
	
	this._11 = m111*m211 + m112*m221;
	this._12 = m111*m212 + m112*m222;
	this._13 = m1._13;

	this._21 = m121*m211 + m122*m221;
	this._22 = m121*m212 + m122*m222;
	this._23 = m1._23;
}
// Times-equals, apply to self
c3d.Mat3.prototype.mul2 = function(m2) {
	var m111 = this._11, m112 = this._12,
	    m121 = this._21, m122 = this._22;
	
	var m211 = m2._11, m212 = m2._12,
	    m221 = m2._21, m222 = m2._22;
	
	this._11 = m111*m211 + m112*m221;
	this._12 = m111*m212 + m112*m222;

	this._21 = m121*m211 + m122*m221;
	this._22 = m121*m212 + m122*m222;
};

// m1*m2, apply to self
c3d.Mat3.prototype.mulm = function(m1, m2) {
	var m111 = m1._11, m112 = m1._12, m113 = m1._13,
	    m121 = m1._21, m122 = m1._22, m123 = m1._23,
	    m131 = m1._31, m132 = m1._32, m133 = m1._33;
	
	var m211 = m2._11, m212 = m2._12, m213 = m2._13,
	    m221 = m2._21, m222 = m2._22, m223 = m2._23,
	    m231 = m2._31, m232 = m2._32, m233 = m2._33;
	
	this._11 = m111*m211 + m112*m221 + m113*m231;
	this._12 = m111*m212 + m112*m222 + m113*m232;
	this._13 = m111*m213 + m112*m223 + m113*m233;

	this._21 = m121*m211 + m122*m221 + m123*m231;
	this._22 = m121*m212 + m122*m222 + m123*m232;
	this._23 = m121*m213 + m122*m223 + m123*m233;

	this._31 = m131*m211 + m132*m221 + m133*m231;
	this._32 = m131*m212 + m132*m222 + m133*m232;
	this._33 = m131*m213 + m132*m223 + m133*m233;
};
// Times-equals, apply to self
c3d.Mat3.prototype.mul = function(m2) {
	var m111 = this._11, m112 = this._12, m113 = this._13,
	    m121 = this._21, m122 = this._22, m123 = this._23,
	    m131 = this._31, m132 = this._22, m133 = this._33;
	
	var m211 = m2._11, m212 = m2._12, m213 = m2._13,
	    m221 = m2._21, m222 = m2._22, m223 = m2._23,
	    m231 = m2._31, m232 = m2._22, m233 = m2._33;
	
	this._11 = m111*m211 + m112*m221 + m113*m231;
	this._12 = m111*m212 + m112*m222 + m113*m232;
	this._13 = m111*m213 + m112*m223 + m113*m233;

	this._21 = m121*m211 + m122*m221 + m123*m231;
	this._22 = m121*m212 + m122*m222 + m123*m232;
	this._23 = m121*m213 + m122*m223 + m123*m233;

	this._31 = m131*m211 + m132*m221 + m133*m231;
	this._32 = m131*m212 + m132*m222 + m133*m232;
	this._33 = m131*m213 + m132*m223 + m133*m233;
};

c3d.Mat3.prototype.scale = function(s) {
	this._11 *= s; this._12 *= s;
	this._21 *= s; this._22 *= s;
	return this;
};
c3d.Mat3.prototype.scaleXY = function(sx, sy) {
	this._11 *= sx; this._12 *= sx;
	this._21 *= sy; this._22 *= sy;
	
	return this;
};

c3d.Mat3.prototype.moveTo = function(x, y) {
	this._13 = x; this._23 = y;
};
c3d.Mat3.prototype.moveBy = function(x, y) {
	this._13 += x; this._23 += y;
};

c3d.Mat3.prototype.clone = function() {
	var c = new c3d.Mat3();
	c._11 = this._11; c._12 = this._12; c._13 = this._13;
	c._21 = this._21; c._22 = this._22; c._23 = this._23;
	c._31 = this._31; c._32 = this._32; c._33 = this._33;
	
	return c;
};

// Pretty darn slow function, but it should only be used in debugging anyway.
c3d.Mat3.prototype.toString = function() {
	return 'mat3: [' +
	'[' + [this._11, this._12, this._13].join(',') + '],' +
	'[' + [this._21, this._22, this._23].join(',') + '],' +
	'[' + [this._31, this._32, this._33].join(',') +
	']]';
};
c3d.Mat3.prototype.toCssString = function() {
	// NOTE: The easier method here has a nasty bug where small numbers
	// get scientific notation, which css can't handle.
	//return 'matrix(' + [this._11, this._12, this._21, this._22, this._13, this._23].join(',') + ')';
	
	// This method has got to be slow :(
	return 'matrix(' + this._11.toFixed(12) + ',' + this._12.toFixed(12) + ',' +
		this._21.toFixed(12) + ',' + this._22.toFixed(12) + ',' +
		this._13.toFixed(12) + ',' + this._23.toFixed(12) + ')';
};
c3d.Mat3.prototype.applyIeFilter = function(node) {
	var f;
	if (!(f = node.filters['DXImageTransform.Microsoft.Matrix'])) {
		node.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(SizingMethod="auto expand")';
		f = node.filters['DXImageTransform.Microsoft.Matrix'];
	} 
	if (!f) {
		throw new Exception('Something failed with IE matrix.');
	}
	f.M11 = this._11; f.M12 = this._21;
	f.M21 = this._12; f.M22 = this._22;
	f.Dx = this._13; f.Dy = this._23;
};

/**
 * @constructor
 * @extends {c3d.MathClass}
 */
c3d.Mat2 = function() {
	c3d.MathClass.call(this);
	this.ident();	// this should get inlined by the compiler
	this.els = [this._11, this._12,
	        	this._21, this._22];
};
c3d.inherits(c3d.Mat2, c3d.MathClass);
	
c3d.Mat2.prototype.ident = function() {
	this._11 = 1.0; this._12 = 0.0;
	this._21 = 0.0; this._22 = 1.0;
};
c3d.Mat2.prototype.zero = function() {
	this._11 = this._12 = this._21 = this._22 = 0.0;
};

// TODO: This could use some optimization probably
c3d.Mat2.prototype.fromArray = function(el) {
	c3d.setupMap(this, this.els, el);
};

c3d.Mat2.prototype.det = function() {
	return this._11*this._22 - this._12*this._21;
};
// TODO: Optimize this by avoiding the det() call: dont duplicate multiplies
c3d.Mat2.prototype.inv = function() {
	var d = this.det();
	if (d < 0.0001 && d > -0.0001) return null;
	
	d = 1.0/d;
	
	this._11 =  d*this._22; this._12 = -d*this._12;
	this._21 = -d*this._21; this._22 =  d*this._11;
	
	return this;
};

c3d.Mat2.prototype.invm = function(m) {
	var d = m.det();
	if (d < 0.0001 && d > -0.0001) return null;
	
	d = 1.0/d;
	
	this._11 =  d*m._22; this._12 = -d*m._12;
	this._21 = -d*m._21; this._22 =  d*m._11;
	
	return this;
};

// m1*m2, apply to self
c3d.Mat2.prototype.mulm = function(m1, m2) {
	var m111 = m1._11, m112 = m1._12,
	    m121 = m1._21, m122 = m1._22;
	
	var m211 = m2._11, m212 = m2._12,
	    m221 = m2._21, m222 = m2._22;
	
	this._11 = m111*m211 + m112*m221;
	this._12 = m111*m212 + m112*m222;

	this._21 = m121*m211 + m122*m221;
	this._22 = m121*m212 + m122*m222;
};

c3d.Mat2.prototype.mul = function(m2) {
	var m111 = this._11, m112 = this._12,
	    m121 = this._21, m122 = this._22;
	
	var m211 = m2._11, m212 = m2._12,
	    m221 = m2._21, m222 = m2._22;
	
	this._11 = m111*m211 + m112*m221;
	this._12 = m111*m212 + m112*m222;

	this._21 = m121*m211 + m122*m221;
	this._22 = m121*m212 + m122*m222;
};

c3d.Mat2.prototype.scale = function(s) {
	this._11 *= s; this._12 *= s;
	this._21 *= s; this._22 *= s;
	
	return this;
};
c3d.Mat2.prototype.scaleXY = function(sx, sy) {
	this._11 *= sx; this._12 *= sx;
	this._21 *= sy; this._22 *= sy;
	
	return this;
};

c3d.Mat2.prototype.clone = function() {
	var c = new c3d.Mat2();
	c._11 = this._11; c._12 = this._12;
	c._21 = this._21; c._22 = this._22;
	
	return c;
};

// Pretty darn slow function, but it should only be used in debugging anyway.
c3d.Mat2.prototype.toString = function() {
	return 'mat2: [' +
	'[' + [this._11, this._12].join(',') + '],' +
	'[' + [this._21, this._22].join(',') +
	']]';
};
c3d.Mat2.prototype.toCssString = function() {
	//return 'matrix(' + [this._11, this._12, this._21, this._22, 0, 0].join(',') + ')';
	
	// NOTE: The easier method here has a nasty bug where small numbers
	// get scientific notation, which css can't handle.
	//return 'matrix(' + [this._11, this._12, this._21, this._22, this._13, this._23].join(',') + ')';
	
	// This method has got to be slow :(
	return 'matrix(' + this._11.toFixed(12) + ',' + this._12.toFixed(12) + ',' +
		this._21.toFixed(12) + ',' + this._22.toFixed(12) + ',0,0)';
};
c3d.Mat2.prototype.applyIeFilter = function(node) {
	var f;
	if (!(f = node.filters['DXImageTransform.Microsoft.Matrix'])) {
		node.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(SizingMethod="auto expand")';
		f = node.filters['DXImageTransform.Microsoft.Matrix'];
	} 
	if (!f) {
		throw new Exception('Something failed with IE matrix.');
	}
	f.M11 = this._11; f.M12 = this._21;
	f.M21 = this._12; f.M22 = this._22;
};

// Identity matrices
/** @const */ c3d.M4 = new c3d.Mat4();
/** @const */ c3d.M3 = new c3d.Mat3();
/** @const */ c3d.M2 = new c3d.Mat2();
