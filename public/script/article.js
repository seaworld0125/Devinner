const buttonPost = document.getElementById("post-button");
const title = document.getElementById("title");

buttonPost.addEventListener('click', (e) => {
    e.preventDefault();

    if(title.value.length == 0) {
        alert('제목을 입력해주세요');
        return;
    } 
    title.value = title.value.replace(/<[^>]+>/g, '');
    
    document.form.target = opener.window.name; // 타켓을 부모창으로 설정
    document.form.submit();

    window.close();
});

function uploadSummernoteImageFile(file, editor) {
    data = new FormData();
    data.append("file", file);
    $.ajax({
        data : data,
        type : "POST",
        url : "/upload/img",
        contentType : false,
        processData : false,
        success : function(data) {
            //항상 업로드된 파일의 url이 있어야 한다.
            $(editor).summernote('insertImage', data.url);
        }
    });
};

$('#summernote').summernote({
    placeholder: 'Hello stand alone ui',
    tabsize: 2,
    height: 300,
    minHeight: 300,                // 최소 높이
    maxHeight: 550,                // 최대 높이
    focus: true,                    // 에디터 로딩후 포커스를 맞출지 여부
    lang: "ko-KR",					// 한글 설정
    placeholder: '최대 2048자까지 쓸 수 있습니다',	//placeholder 설정
    toolbar: [
    ['style', ['style']],
    ['font', ['bold', 'italic', 'underline','strikethrough', 'clear']],
    ['color', ['forecolor','color']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['table', ['table']],
    ['insert', ['link', 'picture']],
    ['view', ['codeview', 'help']]
    ],
    callbacks: {	//콜백 정의
        onImageUpload : function(files) {
            uploadSummernoteImageFile(files[0], this);
        },
        onPaste: function (e) {
            var clipboardData = e.originalEvent.clipboardData;
            if (clipboardData && clipboardData.items && clipboardData.items.length) {
                var item = clipboardData.items[0];
                if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
                    e.preventDefault();
                }
            }
        }
    }
});