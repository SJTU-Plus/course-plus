
import React, { useEffect, useState } from 'react';
import {
    withRouter
} from "react-router-dom";
import axios from "axios";


export default withRouter(({ history }) => {
    const [lessonList, setLessonList] = useState([]);

    useEffect(() => {
        getLessonIndex();
    }, []);

    const getLessonIndex = async () => {
        const response = await axios.get("/course-plus-data/lessonData_index.json");
        setLessonList(response.data);
    };

    return (<div class="form-row">
        <div class="col mb-3">
            <label for="inputSemester">学年学期</label>
            <select
                class="form-control custom-select"
                id="inputSemester"
                onChange={event => history.push(`/${event.target.value}/browse`)}>
                    
                {lessonList.map(option => <option value={`${option.year}_${option.semester}`}>{option.year} 学年, 第 {option.semester} 学期</option>)}
            </select>
        </div>
    </div>)
})
