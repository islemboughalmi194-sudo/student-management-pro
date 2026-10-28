const students = [
  {id:1,name:"Sarah Ben Ali",email:"sarah.benali@etudiant.tn",initials:"SB",course:"Informatique de gestion",grade:16.5,status:"Actif"},
  {id:2,name:"Youssef Mansour",email:"youssef.m@etudiant.tn",initials:"YM",course:"Réseaux informatiques",grade:14.0,status:"Actif"},
  {id:3,name:"Mariem Gharbi",email:"mariem.g@etudiant.tn",initials:"MG",course:"Comptabilité",grade:12.8,status:"En attente"},
  {id:4,name:"Ahmed Trabelsi",email:"ahmed.t@etudiant.tn",initials:"AT",course:"Informatique de gestion",grade:15.2,status:"Actif"},
  {id:5,name:"Nour Bouaziz",email:"nour.b@etudiant.tn",initials:"NB",course:"Marketing",grade:17.1,status:"Actif"},
  {id:6,name:"Omar Khelifi",email:"omar.k@etudiant.tn",initials:"OK",course:"Réseaux informatiques",grade:11.9,status:"En attente"}
];
let nextId = 7;
const rows = document.getElementById("studentRows");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");
const dialog = document.getElementById("studentDialog");
const form = document.getElementById("studentForm");

document.getElementById("today").textContent = new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"});
function initials(name){return name.trim().split(/\s+/).slice(0,2).map(part=>part[0].toUpperCase()).join("");}
function renderStudents(){
  const term = searchInput.value.trim().toLowerCase();
  const course = courseFilter.value;
  const filtered = students.filter(s => (s.name.toLowerCase().includes(term) || s.email.toLowerCase().includes(term)) && (!course || s.course===course));
  rows.innerHTML = "";
  filtered.forEach(s => {
    const tr = document.createElement("tr");
    const studentTd = document.createElement("td");
    studentTd.innerHTML = `<div class="student-cell"><span class="student-avatar">${s.initials}</span><div><div class="student-name"></div><div class="student-email"></div></div></div>`;
    studentTd.querySelector(".student-name").textContent = s.name;
    studentTd.querySelector(".student-email").textContent = s.email;
    const courseTd = document.createElement("td"); courseTd.textContent = s.course;
    const gradeTd = document.createElement("td"); gradeTd.innerHTML = `<span class="grade">${Number(s.grade).toFixed(1)}/20</span>`;
    const statusTd = document.createElement("td");
    const status = document.createElement("span"); status.className = "status" + (s.status==="Actif" ? "" : " pending"); status.textContent=s.status; statusTd.append(status);
    const actionTd = document.createElement("td"); const del = document.createElement("button"); del.className="delete-btn"; del.title="Supprimer"; del.textContent="×"; del.addEventListener("click",()=>{const index=students.findIndex(item=>item.id===s.id);if(index>-1)students.splice(index,1);renderStudents();}); actionTd.append(del);
    [studentTd,courseTd,gradeTd,statusTd,actionTd].forEach(td=>tr.append(td));
    rows.append(tr);
  });
  document.getElementById("tableNote").textContent = `${filtered.length} étudiant(s) affiché(s) · Démonstration avec données fictives`;
  document.getElementById("totalStudents").textContent = 128 + students.length - 6;
}
function openDialog(){dialog.showModal();}
document.getElementById("addTop").addEventListener("click",openDialog);
document.getElementById("closeDialog").addEventListener("click",()=>dialog.close());
document.getElementById("cancelDialog").addEventListener("click",()=>dialog.close());
searchInput.addEventListener("input",renderStudents);
courseFilter.addEventListener("change",renderStudents);
form.addEventListener("submit",event=>{
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name").trim();
  students.unshift({id:nextId++,name,email:name.toLowerCase().replace(/\s+/g,".")+"@etudiant.tn",initials:initials(name),course:data.get("course"),grade:Number(data.get("grade")),status:data.get("status")});
  form.reset();dialog.close();renderStudents();
});
document.getElementById("exportBtn").addEventListener("click",()=>{
  const header=["Nom","Email","Formation","Moyenne","Statut"];
  const csv=[header,...students.map(s=>[s.name,s.email,s.course,s.grade,s.status])].map(row=>row.map(value=>`"${String(value).replace(/"/g,'""')}"`).join(";")).join("\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download="etudiants.csv";link.click();URL.revokeObjectURL(link.href);
});
renderStudents();
