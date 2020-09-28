const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next)=>{
    try {
        const token = req.header('Authorization');
        const decode = jwt.verify(token, process.env.Secrete);
        req.user = decode;
        if(req.user.role === 'Admin') return next();
        return res.status(401).json({error: 'Authorization error'});
    } catch (ex) {
        return res.status(401).json({error: 'Authorization error'});
    }
}

const authManager = (req, res, next)=>{
    try {
        const token = req.header('Authorization');
        const decode = jwt.verify(token, 'myTokenSecreteKey');
        req.user = decode;
        if(req.user.role === 'Manager') return next();
        return res.status(401).json({error: 'Authorization error'});
    } catch (ex) {
        return res.status(401).json({error: 'Authorization error'});
    }
}

const authApplicant = (req, res, next)=>{
    try {
        const token = req.header('Authorization');
        const decode = jwt.verify(token, 'myTokenSecreteKey');
        req.user = decode;
        if(req.user.role === 'Applicant') return next();
        return res.status(401).json({error: 'Authorization error'});
    } catch (ex) {
        return res.status(401).json({error: 'Authorization error'});
    }
}

const authEmployee = (req, res, next)=>{
    try {
        const token = req.header('Authorization');
        const decode = jwt.verify(token, 'myTokenSecreteKey');
        req.user = decode;
        if(req.user.role === 'Employee') return next();
        return res.status(401).json({error: 'Authorization error'});
    } catch (ex) {
        return res.status(401).json({error: 'Authorization error'});
    }
}

exports.authAdmin = authAdmin;
exports.authManager = authManager;
exports.authApplicant = authApplicant;
exports.authEmployee = authEmployee;