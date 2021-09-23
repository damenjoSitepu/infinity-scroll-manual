$(document).ready(function () {
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    } else {
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }
    }

    let start = 0;
    let working = false;

    // Ajax
    let originalAjax = (filePath) => {
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let myData = this.responseText;
                let realData = JSON.parse(myData);

                renderUI(realData.machina);

                start += 10;
            }
        }

        xhr.open('GET', filePath);
        xhr.send();
    }

    // Render UI Content
    function renderUI(dataArray) {
        let elPackage = document.querySelector('.package');
        let initContent = '';

        dataArray.forEach((item, i) => {
            if (i < 10) {
                initContent += `
                <div class="card mb-5" style="width: 18rem;">
                <img src="img/${dataArray[i].img}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${dataArray[i].title}</h5>
                    <p>${dataArray[i].desc}</p>
                    <a href="#" class="btn btn-primary">Kepoin Saya</a>
                </div>
                </div>
            `;
            }
        });

        elPackage.innerHTML = initContent;
    }

    originalAjax('../dataRobot.json');

    // Event Scroll
    $(window).scroll(function () {
        // console.log(parseFloat($(this).scrollTop() + 1) + " | " + parseFloat($('.package').height() - $(window).height()));

        if ($(this).scrollTop() + 1 >= $('.package').height() - $(window).height()) {
            if (!working) {
                working = true;

                $.ajax({
                    type: "GET",
                    url: "../dataRobot.json",
                    processData: false,
                    contentType: "application/json",
                    data: '',
                    success: function (data) {
                        let initContent = '';

                        for (let i = start; i <= start + 9; i++) {

                            initContent += `
                                <div class="card mb-5" style="width: 18rem;">
                                <img src="img/${data.machina[i].img}" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">${data.machina[i].title}</h5>
                                    <p>${data.machina[i].desc}</p>
                                    <a href="#" class="btn btn-primary">Kepoin Saya</a>
                                </div>
                                </div>
                            `;

                        }
                        console.log('Perbandingan : ' + data.machina.length + ' | ' + start);

                        start += 10;
                        setTimeout(function () {
                            if (start < data.machina.length) {
                                working = false;
                            } else {
                                working = true;
                            }
                        }, 500);

                        $(".package").append(initContent);
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            }
        }
    });







});