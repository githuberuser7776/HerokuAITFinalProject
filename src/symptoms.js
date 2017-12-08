function getSymptoms (res, req, next){
  let theSymptom = req.body.symptomName;
  console.log(theSymptom);
  next();
}

function getPain (res,req,next){
  req.thePain = req.get("number");
  console.log(req.thePain + "2");
}

module.exports = {
  getSymptoms: getSymptoms,
}
