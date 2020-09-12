
import React, { useEffect, useState } from 'react';
import {
    withRouter
} from "react-router-dom";
import { get } from 'axios';
import Form from 'react-bootstrap/Form'

export default withRouter(({ history }) => {
    const [lessonList, setLessonList] = useState([]);
    
    useEffect(() => {
        const getLessonIndex = async () => {
            const response = (await get("/course-plus-data/lessonData_index.json")).data;
            const lastIndex = response[response.length - 1];
            history.push(`/${lastIndex.year}_${lastIndex.semester}/browse`)
            setLessonList(response);
        };

        getLessonIndex();
    }, [history]);

    return (<div className="form-row">
        <Form.Group className="col mb-3">
            <Form.Label>学年学期</Form.Label>
            <Form.Control as="select" custom
                onChange={event => history.push(`/${event.target.value}/browse`)}>
                    
                {lessonList.map(option =>
                    <option value={`${option.year}_${option.semester}`} key={`${option.year}_${option.semester}`}>
                        {option.year} 学年,
                        第 {option.semester} 学期
                        (更新于 {option.updated_at})
                    </option>
                    ).reverse()}
            </Form.Control>
        </Form.Group>
    </div>)
})
