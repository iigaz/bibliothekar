var msnry = new Masonry(".bookshelf", {
    itemSelector: ".book",
    fitWidth: true,
});
const xhr = new XMLHttpRequest();
const bookshelf = document.getElementById("bookshelf");

const knownLanguages = {
    en: "English",
    fr: "French",
    fi: "Finnish",
    de: "German",
    nl: "Dutch",
    it: "Italian",
    es: "Spanish",
    pt: "Portuguese",
    zh: "Chinese",
    el: "Greek",
    sv: "Swedish",
    hu: "Hungarian",
    la: "Latin",
    eo: "Esperanto",
    da: "Danish",
    tl: "Tagalog",
    ca: "Catalan",
    pl: "Polish",
    ja: "Japanese",
    no: "Norwegian",
    cy: "Welsh",
    cs: "Czech",
    ru: "Russian",
    fur: "Friulian",
    is: "Icelandic",
    bg: "Bulgarian",
    he: "Hebrew",
    enm: "Middle English",
    te: "Telugu",
    af: "Afrikaans",
    ang: "Old English",
    sr: "Serbian",
    ceb: "Cebuano",
    grc: "Greek, Ancient",
    ilo: "Iloko",
    nah: "Nahuatl",
    nav: "Navajo",
    nai: "North American Indian",
    arp: "Arapaho",
    brx: "Bodo",
    fy: "Frisian",
    gla: "Gaelic, Scottish",
    gl: "Galician",
    ga: "Irish",
    mi: "Maori",
    myn: "Mayan Languages",
    ro: "Romanian",
    ale: "Aleut",
    ar: "Arabic",
    br: "Breton",
    rmq: "Caló",
    et: "Estonian",
    fa: "Farsi",
    kld: "Gamilaraay",
    ia: "Interlingua",
    iu: "Inuktitut",
    csb: "Kashubian",
    kha: "Khasi",
    ko: "Korean",
    lt: "Lithuanian",
    nap: "Napoletano-Calabrese",
    oc: "Occitan",
    oji: "Ojibwa",
    sa: "Sanskrit",
    sl: "Slovenian",
    bgs: "Tagabawa",
    yi: "Yiddish",
};

//// Gutenberg does not support CORS headers, which prevents
//// this script from requesting it in the browser

// function getKnownLanguages() {
//     xhr2 = new XMLHttpRequest();
//     xhr2.open("GET", "https://www.gutenberg.org/ebooks/", false);
//     xhr2.send();
//     parser = new DOMParser();
//     dom = parser.parseFromString(xhr2.responseText, "text/html");
//     let o = Object.fromEntries(
//         Array.from(
//             dom
//                 .getElementsByClassName("pgdbnavbar")[0]
//                 .getElementsByTagName("p")
//         )
//             .filter((paragraph) => paragraph.innerText.startsWith("Languages"))
//             .map((paragraph) =>
//                 Array.from(paragraph.getElementsByTagName("a")).map((link) => [
//                     link.href.split("/").slice(-1)[0],
//                     link.title,
//                 ])
//             )
//             .flat()
//     );
//     let sorted = Object.keys(o).sort(
//         (a, b) => Number(o[a].match(/\d+/)[0]) < Number(o[b].match(/\d+/)[0])
//     );
//     return Object.fromEntries(
//         sorted.map((lang) => [lang, o[lang].split(" ").slice(0, -1).join(" ")])
//     );
// }

function setKnownLanguages(knownLanguages) {
    let search_lang = document.getElementById("search-lang");
    search_lang.innerHTML = '<option value="">Any Language</option>';
    Object.keys(knownLanguages).forEach(
        (lang) =>
            (search_lang.innerHTML +=
                '<option value="' +
                lang +
                '">' +
                knownLanguages[lang] +
                "</option>")
    );
}

function createBookDetails(_book) {
    let details_cover_image = document.getElementById("details-cover-image");
    let details_cover_copyright = document.getElementById(
        "details-cover-copyright"
    );
    let details_title = document.getElementById("details-title");
    let details_description = document.getElementById("details-description");
    let details_downloads_content = document.getElementById(
        "details-downloads-content"
    );
    let details_read_content = document.getElementById("details-read-content");
    let details_subjects_content = document.getElementById(
        "details-subjects-content"
    );
    details_cover_image.src = _book.formats["image/jpeg"];
    details_cover_image.alt = _book.title;
    if (_book.copyright === false)
        details_cover_copyright.classList.add("details-cover-copyright-show");
    else
        details_cover_copyright.classList.remove(
            "details-cover-copyright-show"
        );
    details_title.innerHTML = _book.title;
    details_description.innerHTML = "";
    if (_book.authors.length > 0) {
        details_description.innerHTML +=
            "<p>" +
            _book.authors
                .map(
                    (author) =>
                        author.name +
                        (author.birth_year && author.death_year
                            ? " (" +
                              author.birth_year +
                              " – " +
                              author.death_year +
                              ")"
                            : author.birth_year
                            ? " (" + author.birth_year + ")"
                            : "")
                )
                .reduce((a1, a2) => a1 + "<br>" + a2) +
            "</p>";
    }
    if (_book.translators.length > 0) {
        details_description.innerHTML +=
            "<p>Translation:<br>" +
            _book.translators
                .map(
                    (author) =>
                        author.name +
                        (author.birth_year && author.death_year
                            ? " (" +
                              author.birth_year +
                              " – " +
                              author.death_year +
                              ")"
                            : author.birth_year
                            ? " (" + author.birth_year + ")"
                            : "")
                )
                .reduce((a1, a2) => a1 + "<br>" + a2) +
            "</p>";
    }

    details_description.innerHTML +=
        "<p> Downloads: " + _book.download_count + "</p>";

    details_subjects_content.innerHTML = "";
    if (_book.subjects.length > 0)
        details_subjects_content.innerHTML +=
            "<p>" +
            _book.subjects
                .map((subject) => subject.replaceAll("--", "–") + "<br>")
                .join("") +
            "</p>";

    details_downloads_content.innerHTML = "";
    details_read_content.innerHTML = "";

    let sorted = Object.keys(_book.formats).sort();
    sorted.forEach((format) => {
        if (format != "image/jpeg" && format != "application/rdf+xml") {
            if (format.startsWith("application/x-mobipocket-ebook")) {
                details_downloads_content.innerHTML +=
                    '<a target="_blank" href="' +
                    _book.formats[format] +
                    '">MOBI</a>';
            } else if (format.startsWith("application/epub+zip")) {
                details_downloads_content.innerHTML +=
                    '<a target="_blank" href="' +
                    _book.formats[format] +
                    '">EPUB3</a>';
            } else if (format.startsWith("application/octet-stream")) {
                details_downloads_content.innerHTML +=
                    '<a target="_blank" href="' +
                    _book.formats[format] +
                    '">ZIP</a>';
            } else if (_book.formats[format].endsWith(".txt.utf-8")) {
                details_downloads_content.innerHTML +=
                    '<a target="_blank" href="' +
                    _book.formats[format] +
                    '">TXT</a>';
            } else if (_book.formats[format].endsWith(".txt")) {
                details_downloads_content.innerHTML +=
                    '<a target="_blank" href="' +
                    _book.formats[format] +
                    '">TXT (ascii)</a>';
            } else if (_book.formats[format].endsWith(".htm")) {
                details_read_content.innerHTML +=
                    '<a target="_blank" href="' +
                    _book.formats[format] +
                    '">Plain</a>';
            } else if (_book.formats[format].endsWith(".html.images")) {
                details_read_content.innerHTML +=
                    '<a target="_blank" href="' +
                    _book.formats[format] +
                    '">HTML5</a>';
            }
        }
    });

    if (details_downloads_content.innerHTML)
        details_downloads_content.style.display = "block";
    else details_downloads_content.style.display = "none";
    if (details_read_content.innerHTML)
        details_read_content.style.display = "block";
    else details_read_content.style.display = "none";
    document
        .getElementById("details-modal")
        .parentElement.classList.remove("modal-closed");
    document.body.style.overflow = "hidden";
}

function createBook(_book) {
    let book = document.createElement("div");
    book.className = "book";
    let book_cover = document.createElement("img");
    book_cover.src = _book.formats["image/jpeg"];
    book_cover.alt = _book.title;
    book.appendChild(book_cover);
    book.style.background_image = "images/cover.jpg";
    let book_desc = document.createElement("div");
    book_desc.className = "book-desc";
    let book_title = document.createElement("h1");
    book_title.innerText = _book.title;
    let book_details = document.createElement("p");
    if (_book.authors.length > 0) {
        book_details.innerHTML = _book.authors
            .map((author) => author.name)
            .reduce((a1, a2) => a1 + "<br>" + a2);
    }
    let book_downloads = document.createElement("p");
    book_downloads.innerText = "Downloads: " + _book.download_count;
    book_desc.appendChild(book_title);
    book_desc.appendChild(book_details);
    book_desc.appendChild(book_downloads);
    book.appendChild(book_desc);
    book_desc.onclick = () => createBookDetails(_book);
    return book;
}

function setLoader(enabled) {
    let loader = document.getElementById("loader");
    if (enabled) loader.classList.remove("loaded");
    else loader.classList.add("loaded");
}

function setLoadMore(load_more_link) {
    let load_more = document.getElementById("load-more-button");
    if (load_more_link) {
        load_more.innerText = "Load more...";
        load_more.removeAttribute("disabled");
        load_more.style.opacity = 1;
        load_more.onclick = () => {
            load_more.onclick = () => console.log("Loading...");
            load_more.innerText = "Loading...";
            load_more.setAttribute("disabled", "");
            loadBooks(load_more_link);
        };
    } else {
        load_more.style.opacity = 0;
        load_more.setAttribute("disabled", "");
        load_more.onclick = () => console.log("Nothing more to load.");
    }
}

function loadBooks(api_link) {
    xhr.open("GET", api_link);
    xhr.responseType = "json";
    xhr.send();
}

function removeBooks() {
    bookshelf.innerHTML = "";
    msnry.remove(msnry.getItemElements());
    msnry.layout();
}

function generateSearhQuery() {
    let lang_elem = document.getElementById("search-lang");
    let query_elem = document.getElementById("search-box");
    let type_elem = document.getElementById("search-type");
    let cf_elem = document.getElementById("search-cf");

    let url = new URL("https://gutendex.com/books");
    if (lang_elem.value) url.searchParams.append("languages", lang_elem.value);
    if (query_elem.value)
        url.searchParams.append(
            type_elem.value == "topic" ? "topic" : "search",
            query_elem.value
        );
    if (cf_elem.checked) url.searchParams.append("copyright", "false");

    console.log(url);
    return url;
}

function search() {
    removeBooks();
    setLoader(true);
    loadBooks(generateSearhQuery());
    return false;
}

function initialize() {
    setLoadMore(false);
    setLoader(true);
    setKnownLanguages(knownLanguages);
    document.getElementById("search-form").onsubmit = search;
    Array.from(document.getElementsByClassName("dropdown-button")).forEach(
        (element) =>
            (element.onclick = () =>
                element.nextElementSibling.classList.toggle(
                    "dropdown-content-show"
                ))
    );
    window.onclick = (event) => {
        if (!event.target.classList.contains("dropdown-button")) {
            Array.from(
                document.getElementsByClassName("dropdown-content")
            ).forEach((element) =>
                element.classList.remove("dropdown-content-show")
            );
        }
    };
    Array.from(document.getElementsByClassName("modal-background")).forEach(
        (element) =>
            (element.onclick = () => {
                element.parentElement.classList.add("modal-closed");
                document.body.style.overflow = "auto";
            })
    );
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            setLoader(false);
            this.response.results.forEach((book) => {
                let b = createBook(book);
                bookshelf.appendChild(b);
                msnry.appended(b);
            });
            msnry.layout();
            setLoadMore(this.response.next);
        }
    });
    removeBooks();
    loadBooks("https://gutendex.com/books?copyright=false");
}

initialize();
