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

                start += realData.machina.length <= 10 ? realData.machina.length : 10;
            }
        }

        xhr.open('GET', filePath);
        xhr.send();
    }

    // Render UI Content
    function renderUI(dataArray) {
        let elPackage = document.querySelector('.package');
        let initContent = '';

        incrementCond = dataArray.length <= 10 ? dataArray.length : 10;

        dataArray.forEach((item, i) => {
            if (i < incrementCond) {
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
        if ($(this).scrollTop() + 1 >= $('.package').height() - $(window).height()) {
            // Set Time Out Untuk load bar animation

            if (!working) {
                working = true;

                $.ajax({
                    type: "GET",
                    url: "../dataRobot.json",
                    processData: false,
                    contentType: "application/json",
                    data: '',
                    success: function (data) {
                        if (start < data.machina.length) {
                            $(".animations").toggleClass('animation');
                            setTimeout(() => {
                                $(".animations").toggleClass('animation');
                                let initContent = '';
                                let checkMoreAdd = (data.machina.length - start) > 10 ? 10 : (data.machina.length - start);
                                let incrementCond = data.machina.length <= 10 ? data.machina.length : start + checkMoreAdd;

                                for (let i = start; i < incrementCond; i++) {
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
                                start += checkMoreAdd;

                                setTimeout(function () {
                                    working = false;
                                }, 500);

                                $(".package").append(initContent);

                            }, 2000);
                        }
                    }
                });
            }



        }
    });







});