document.addEventListener('DOMContentLoaded', () => {
    let students = JSON.parse(localStorage.getItem('students')) || [];

    function saveStudents() {
        localStorage.setItem('students', JSON.stringify(students));
    }

    function calculateStatus(student) {
        const averageGrade = (student.grade1 + student.grade2) / 2;
        if (averageGrade >= 70 && student.absences <= 0.25 * student.totalClasses) {
            return 'Aprovado';
        } else {
            if (averageGrade < 70 && student.absences > 0.25 * student.totalClasses) {
                return 'Reprovado por Nota e Falta';
            } else if (averageGrade < 70) {
                return 'Reprovado por Nota';
            } else {
                return 'Reprovado por Falta';
            }
        }
    }

    function updateDashboard() {
        const dashboardDiv = document.getElementById('dashboard');
        if (dashboardDiv) {
            const passed = students.filter(student => student.status === 'Aprovado').length;
            const failed = students.filter(student => student.status !== 'Aprovado').length;
            const average = (students.reduce((sum, student) => sum + (student.grade1 + student.grade2) / 2, 0) / students.length) || 0;

            document.getElementById('average-grade').textContent = average.toFixed(2);
            document.getElementById('passed-students').textContent = passed;
            document.getElementById('failed-students').textContent = failed;
        }
    }

    function updateResults() {
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.innerHTML = '';

            students.forEach((student, index) => {
                const status = student.status || calculateStatus(student);
                student.status = status; // Ensure status is saved
                const reason = student.reason || '';

                const studentDiv = document.createElement('div');
                studentDiv.innerHTML = `
                    <p>Nome: ${student.name}</p>
                    <p>Nota 1º Trimestre: ${student.grade1}</p>
                    <p>Nota 2º Trimestre: ${student.grade2}</p>
                    <p>Faltas: ${student.absences}</p>
                    <p>Disciplina: ${student.subject}</p>
                    <p>Quantidade Total de Aulas: ${student.totalClasses}</p>
                    <p>Status: ${status}</p>
                    ${reason ? `<p>Motivo: ${reason}</p>` : ''}
                `;
                if (status !== 'Aprovado') {
                    studentDiv.innerHTML += `<button onclick="approveStudent(${index})">Aprovar</button>`;
                } else {
                    studentDiv.innerHTML += `<button onclick="reproveStudent(${index})">Reprovar</button>`;
                }
                resultsDiv.appendChild(studentDiv);
            });

            saveStudents(); // Save students with updated status
        }
    }

    function updateStudentList() {
        const studentListDiv = document.getElementById('student-list');
        if (studentListDiv) {
            studentListDiv.innerHTML = '';

            students.forEach((student, index) => {
                const status = student.status || calculateStatus(student);
                student.status = status; // Ensure status is saved

                const studentDiv = document.createElement('div');
                studentDiv.innerHTML = `
                    <p>Nome: ${student.name}</p>
                    <p>Nota 1º Trimestre: ${student.grade1}</p>
                    <p>Nota 2º Trimestre: ${student.grade2}</p>
                    <p>Faltas: ${student.absences}</p>
                    <p>Disciplina: ${student.subject}</p>
                    <p>Quantidade Total de Aulas: ${student.totalClasses}</p>
                    <p>Status: ${status}</p>
                    <button onclick="editStudent(${index})">Editar</button>
                    <button onclick="deleteStudent(${index})">Excluir</button>
                `;
                studentListDiv.appendChild(studentDiv);
            });

            saveStudents(); // Save students with updated status
        }
    }

    window.editStudent = function(index) {
        const student = students[index];
        document.getElementById('student-id').value = index;
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-grade1').value = student.grade1;
        document.getElementById('student-grade2').value = student.grade2;
        document.getElementById('student-absences').value = student.absences;
        document.getElementById('student-subject').value = student.subject;
        document.getElementById('student-total-classes').value = student.totalClasses;
    }

    window.deleteStudent = function(index) {
        students.splice(index, 1);
        saveStudents();
        updateStudentList();
        updateDashboard();
        updateResults();
    }

    window.approveStudent = function(index) {
        const reason = prompt('Justificativa para aprovação:');
        if (reason) {
            students[index].status = 'Aprovado';
            students[index].reason = reason;
            saveStudents();
            updateStudentList();
            updateDashboard();
            updateResults();
        }
    }

    window.reproveStudent = function(index) {
        const reason = prompt('Justificativa para reprovação:');
        if (reason) {
            students[index].status = 'Reprovado';
            students[index].reason = reason;
            saveStudents();
            updateStudentList();
            updateDashboard();
            updateResults();
        }
    }

    if (document.getElementById('student-form')) {
        document.getElementById('student-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('student-name').value.trim();
            const grade1 = parseFloat(document.getElementById('student-grade1').value.trim());
            const grade2 = parseFloat(document.getElementById('student-grade2').value.trim());
            const absences = parseInt(document.getElementById('student-absences').value.trim());
            const subject = document.getElementById('student-subject').value.trim();
            const totalClasses = parseInt(document.getElementById('student-total-classes').value.trim());

            if (name && !isNaN(grade1) && !isNaN(grade2) && !isNaN(absences) && subject && !isNaN(totalClasses)) {
                const editIndex = document.getElementById('student-id').value;

                if (editIndex !== '') {
                    students[editIndex] = { name, grade1, grade2, absences, subject, totalClasses, status: calculateStatus({ name, grade1, grade2, absences, subject, totalClasses }) };
                } else {
                    students.push({ name, grade1, grade2, absences, subject, totalClasses, status: calculateStatus({ name, grade1, grade2, absences, subject, totalClasses }) });
                }

                saveStudents();
                document.getElementById('student-form').reset();
                updateStudentList();
                updateDashboard();
                updateResults();
            }
        });

        document.getElementById('clear-storage').addEventListener('click', function() {
            localStorage.clear();
            students = [];
            updateStudentList();
            updateDashboard();
            updateResults();
        });

        updateStudentList();
    }

    if (document.getElementById('dashboard')) {
        updateDashboard();
    }

    if (document.getElementById('results')) {
        updateResults();
    }
});
