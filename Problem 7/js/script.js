$(document).ready(function() {
    let studentList, classList;
    $.get(
        "http://45.76.156.126/getdata.php?",
        {
            Type : "Student"
        },
        function(data) {
            studentList = data;
            studentList.sort(compare);
            showStudentList(studentList);
        },
        "json"
    );

    $.get(
        "http://45.76.156.126/getdata.php?",
        {
            Type : "Class"
        },
        function(data) {
            // 1. Get Class List Date
            classList = data;
            // 2. Append Class List Section
            let str1 = "";
            for(let i = 0; i < classList.length; i++) {
                str1 += `<li class="item">${classList[i]}</li>`;
            }
            $("#classGroup").html("");
            $("#classGroup").append(str1);
            // 3. Append Class Select Box of the form
            let str2 = "";
            for (let i = 0; i < classList.length; i++) {
                str2 += `<option value="${classList[i]}">${classList[i]}</option>`;
            }
            $("#Class").html("");
            $("#Class").append(str2);
        },
        "json"
    );

    // Add a new student
    $("#Submit").click(function() {
        let _ID = $("#ID").val();
        let _Name = $("#Name").val();
        let _Email = $("#Email").val();
        let _Class = $("#Class").val();

        let _function = $("#Submit").attr("data-function");
        if(_function == "Add") {
            studentList.unshift(
                {
                    "ID" : _ID, 
                    "Name" : _Name,
                    "Email" : _Email,
                    "Class" : _Class
            });
        } else {
            for(let i = 0; i < studentList.length; i++) {
                if (studentList[i].ID == _ID) {
                    studentList[i].Name = _Name;
                    studentList[i].Email = _Email;
                    studentList[i].Class = _Class;
                    break;
                }
            }
            $("#Submit").attr("data-function", "Add");
        }
        $("#ID").val("");
        $("#Name").val("");
        $("#Email").val("");
        $("#Class").val("");
        showStudentList(studentList);
    });

    // Show students by class
    $("#classGroup").on("click", ".item", function() {
        let _value = $(this).html();
        let str = "";
        let orderNumber = 1;
        for (let i = 0; i < studentList.length; i++) {
            if(studentList[i].Class == _value) {
                str += `<tr>
                        <th scope="row">${orderNumber++}</th>
                        <td>${studentList[i].Name}</td></td>
                        <td>${studentList[i].ID}</td>
                        <td>${studentList[i].Email}</td>
                        <td>
                            <span class="Edit mr-3" data-ID="${studentList[i].ID}">Edit</span>
                            <span class="Del" data-ID="${studentList[i].ID}">Delete</span>
                        </td>
                    </tr>`
            }
        }
        $("tbody").html("");
        $("tbody").append(str);
    });
    // Search by Name
    $("#Searchbtn").click(function() {
        let _Name = $("#Search").val();
        let result = studentList.filter(function(e) {
            return e.Name.includes(_Name);
        });
        $("#Search").val("");
        showStudentList(result);
    });
    // Delete
    $("tbody").on("click", ".Del", function() {
        let _confirm = confirm("Are you sure you want to delete?");
        if(_confirm) {
            let _ID = $(this).attr("data-ID");
            for(let i = 0; i < studentList.length; i++) {
                if (studentList[i].ID == _ID) {
                    studentList.splice(i, 1);
                    break;
                }
            }
            showStudentList(studentList);
        }
    });
    //Edit
    $("tbody").on("click", ".Edit", function() {
        let _ID = $(this).attr("data-ID");
        for(let i = 0; i < studentList.length; i++) {
            if (studentList[i].ID == _ID) {
                $("#ID").val(studentList[i].ID);
                $("#Name").val(studentList[i].Name);
                $("#Email").val(studentList[i].Email);
                $("#Class").val(studentList[i].Class);
                $("#Submit").attr("data-function", "Edit");
                break;
            }
        }
    });
    // Compare 2 objs
    function compare(a, b) {
        if(a.Name > b.Name) {
            return 1;
        }
        if(a.Name < b.Name) {
            return -1;
        }
        return 0;
    }

    // Show list of students on table
    function showStudentList(studentList) {
        let str = "";
        for (let i = 0; i < studentList.length; i++) {
            str += `<tr>
                        <th scope="row">${i + 1}</th>
                        <td>${studentList[i].Name}</td>
                        <td>${studentList[i].ID}</td>
                        <td>${studentList[i].Email}</td>
                        <td>
                            <span class="Edit mr-3" data-ID="${studentList[i].ID}">Edit</span>
                            <span class="Del" data-ID="${studentList[i].ID}">Delete</span>
                        </td>
                    </tr>`
        }
        $("tbody").html("");
        $("tbody").append(str);
    }
});
