const button = document.querySelector(".btn");
const data = document.querySelector(".data");
const S = document.querySelector(".data #s strong");
const K = document.querySelector(".data #k strong");
const L = document.querySelector(".data #l strong");
const alfa = document.querySelector(".data #alfa strong");
const T = document.querySelector(".data #t strong");
const q = document.querySelector(".data #q strong");
const nh = document.querySelector(".data #nh strong");



asyncF = (a, b) => {
    return new Promise((res, err) => {

        if (a > b) {
            res("liczba A wieksza od B")
        } else {
            err("liczba B wieksza")
        }
    })
}

asyncF(6,10)
.then(res => console.log(res))
.catch(err=>console.log(err));


url = "data.json";

button.addEventListener("click", () => {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            S.innerHTML = data.S;
            K.innerHTML = data.K;
            L.innerHTML = data.L;
            alfa.innerHTML = data.alfa;
            T.innerHTML = data.T;
            q.innerHTML = data.q;
            nh.innerHTML = data.nh;
        })
})