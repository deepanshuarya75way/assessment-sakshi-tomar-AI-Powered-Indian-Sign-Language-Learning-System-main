from flask import Blueprint, request,
jsonify
import os,based64,cv2,numpy as np

sign_search_bp=Blueprint('sign_search',_name_)
SIGNS={
  "A":["first","closed hand"],"B":["flat hand","fingers up"],
  "C":["curved","c shaped"],"D":["index up","circle"],
  "E":["bent fingers,claws","c shaped"],"F":["ok sign","circle"],
   "G":["pointing sideway"],"H":["two fingers sideways"],
    "I":["pinky up"],"J":["draw j","hook"],
     "K":["peace","two fingers up"],"L":["I shape","gun"],
      "M":["three fingers"],"N":["two fingers over thumb"],
       "O":["circle","round"],
       "R":["crossed fingers"],
         "S":["fist","closed"],"T":["thumb between"],
          "U":["bunny ears","two up"],"V":["v sign","peace","victory"],
           "W":["three fingers up"],"X":["hook finger"],
            "Y":["hang loose","pinky thumb"],"Z":["draw z","zigzag"],
         

}
_history = []
@sign_search_bp.route('/sign-search/description',methods=['POST'])
def search():
  query=(request.get_json() or {}).get('query','').lower()
  results=[]
  for sign, keywords in SIGNS.items():
    if query.upper()==sign or any(query in k for k in keywords):
      results.append({
        "sign":sign,
        "keywords":keywords,
        "preview_url": f"http://127.0.0.1:5000/static/asl_images/{sign}/{sign}.jpg",
        "drill_url":f"/image-mode?search={sign}",
        "learn_url":f"/video-mode?sign={sign}"
      })
       return {"query":query,"results":results[:8]}

@sign_search_bp.route('/sign-search/gesture',methods=['POST'])
def gesture():
  from app import model,LABELS
  if not model: return {"error": "Model offline"},500
  img_data=(request.get_json()or{}).get('image','')
  if ',' in  img_data:img_data=img_data.split(','1)[1]
  nparr= np.frombuffer(based64.b64decode(img_data),np.uint8)
  frame=cv2.imdecode(nparr,cv2.IMREAD_COLOR)
  img = cv2.resize(frame,(64,64))
  img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB).astype('float32')/255.0
  preds=model.predict(np.expand_dims(img,0),verbose=0)[0]
  top= [{ "sign":LABELS.get(int(i),'?'),"confidence":round(float(preds[i])*100,1)}
        for i in np.argsort(preds)[::-1][:5] if float (preds[i])>0.1]
  return {"results":top}

  @sign_search_bp.route('/sign-search/history',methods=['GET','POST','DELETE'])
  def history():
    if request.method =='GET': return {"history": _history[-10:][::-1]}
    if request.method=='POST':
      _history.append(request.get_json()or {})
      return {"message": "saved"},201
    _history.clear()
    return {"message": "cleared"}