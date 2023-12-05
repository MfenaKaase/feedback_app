const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener('click', function () {
    const searchResults = document.getElementById('searchResults');
    let htmlString = '<p>Showing results for...</p>';

    let query = searchInput.value;

    fetch(`http://localhost:8983/solr/feedback/select?fl=url,total_active_time,search_query,page_title,leading_paragraph,total_copy,score&indent=true&q.op=OR&q=${query}&useParams=`)
        .then(function (response) {
            return response.json();
        })
        .then(function (results) {
            let docs = results.response.docs
            docs.forEach(doc => {
                doc.interestWeight = 0.281 * doc.total_copy + 0.002 * doc.total_active_time + 2.9778;
                doc.aggregatedWeight = doc.interestWeight + doc.score;
            });

            docs.sort((a, b) => b.aggregatedWeight - a.aggregatedWeight);

            htmlString += '<ul>'
            docs.forEach(function(doc) {
                htmlString += `<li class="result"><a href="${doc.url[0]}">${doc.page_title[0]}</a>
                    <p>${doc.leading_paragraph}</p>
                    <div>score:<span style="color:green"> ${doc.aggregatedWeight}</span></div>
                </li>`
            })

            htmlString += '</ul>'
            searchResults.innerHTML = htmlString;
        })
});

