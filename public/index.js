let loading = false;

$("#form").submit(function (event) {
    event.preventDefault();
    if (loading) return;
    document.getElementById("result").innerHTML = `Loading...`;
    document.getElementById("final_url").innerHTML = `https://epicalendarv2.omnirem.dev/${event.target[0].value}/${event.target[1].value}.ics`;
    fetch(`/${event.target[0].value}/${event.target[1].value}.ics`)
        .then((response) => {
            if (response.status !== 200) {
                response.json().then(function (data) {
                    document.getElementById("result").innerHTML = data.error;
                    loading = false;
                });
            } else {
                response.text().then(function (data) {
                    document.getElementById("result").innerHTML = data;
                    loading = false;
                });
            }

        })
        .catch(function (err) {
            document.getElementById("result").innerHTML = err;
        });
});