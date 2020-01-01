import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Exercise = props => (
  <tr>
    <td>{props.student.name}</td>
    <td>{props.major}</td>
    <td>{isNaN(props.mark) ? '-' : props.mark}</td>
    <td>{props.student.email}</td>
    <td>{props.student.phone}</td>
    <td>{props.student.birthday.substring(0,10)}</td>
    <td>
      <Link to={"/edit/student/"+props.student._id} onClick={()=>console.log('hhhhhh')}>edit</Link> | <a href="#" onClick={() => { props.deleteStudent(props.student._id) }}>delete</a>
    </td>
  </tr>
)

export default class Students extends Component {
  constructor(props) {
    super(props);

    this.deleteStudent = this.deleteStudent.bind(this)

    this.state = {
      students: [],
      majors: [],
      marks: [],
      avrgMarks:[],
    };
  }

  componentDidMount() {
    axios.get('http://localhost:5000/students').then(response => {
      this.setState({students: response.data});
      axios.get('http://localhost:5000/marks').then(response => {
        this.setState({marks: response.data});
        // console.log(this.state.marks);
        this.state.students.forEach(student => {
          var sum = 0;
          const marks = this.state.marks.filter(mark => mark.student === student._id);
          // console.log(marks);
          marks.forEach(mark => {
            // if(mark.mark !== null)
            sum+=mark.mark;
          });
          this.setState({avrgMarks: [...this.state.avrgMarks, {student: student._id, mark: sum/marks.length}]});
          // console.log(this.state.avrgMarks);
        });
        console.log(this.state.avrgMarks);
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
    axios.get('http://localhost:5000/majors').then(response => {
      this.setState({majors: response.data});
    }).catch(err => console.log(err));
  }

  deleteStudent(id) {
    axios.delete('http://localhost:5000/students/'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      students: this.state.students.filter(el => el._id !== id)
    })
  }

  studentsList() {
    var sum = 0;
    return this.state.students.map(currentStudent => {
      return <Exercise student={currentStudent} deleteStudent={this.deleteStudent} key={currentStudent._id} major={this.state.majors.filter(major => currentStudent.major === major._id).map(major => major.name)}
      // mark={() => {
      //   var sum = 0;
      //   var marks = this.state.marks.filter(mark => currentStudent._id === mark.student).forEach(mark => sum+= mark.mark);
      //   marks.forEach(mark => sum+= mark.mark);
      //   return sum/marks.length;
      // }}
      mark={this.state.avrgMarks.filter(mark => mark.student === currentStudent._id).map(mark => mark.mark)}
      />;
    })
  }

  getMark(currentStudent){
    var sum = 0;
    var marks = this.state.marks.filter(mark => currentStudent._id === mark.student);
    marks.forEach(mark => sum+= mark.mark);
    return sum/marks.length;
  }

  render() {
    return (
      <div className='text-left'>
        <Link to='/add/student'>
        <button type="button" className="btn btn-dark btn-lg float-right">
        Add New Student
        </button>
        </Link>
        <h1>EST Essouira Students:</h1>
        <hr/>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Major</th>
              <th>Mark</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Birthday</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { this.studentsList() }
          </tbody>
        </table>
      </div>
    )
  }
}