function submitComplaint() {
    const complaintText = document.getElementById("complaint").value;

    fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: complaintText
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result").innerText =
            "Predicted Category: " + data.predicted_category;
    })
    .catch(error => {
        document.getElementById("result").innerText =
            "Error connecting to backend";
    });
}