import "./Editor.css";
// import ToolBar from "./ToolBar";
// import TopNavigate from '../../navigate/top_nav';
import { BiBox, BiImage, BiSolidEraser, BiSave } from "react-icons/bi";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { IoArrowBackSharp } from "react-icons/io5";
import { RiDownloadLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { useEffect, useRef, useState } from "react";


const User = () => {

    const trigger = document.querySelector('#btn-user');
    const hiddenContent = document.querySelector('.dropdown-place');

    // Hold for show dropdown user menu
    if (trigger && hiddenContent) {
        trigger.addEventListener('mouseover', function() {
            hiddenContent.style.display = 'block';
        });
        trigger.addEventListener('mouseout', function() {
            hiddenContent.style.display = 'none';
        });
        hiddenContent.addEventListener('mouseover', function() {
            hiddenContent.style.display = 'block';
        });
        hiddenContent.addEventListener('mouseout', function() {
            hiddenContent.style.display = 'none';
        });
    }

    return (
        <div className="user-place">
            <div className="user">
                <span id="btn-user"></span>
            </div>
            <div className="dropdown-place">
                <ul className="dropdown">
                    <li>Face registration</li>
                    <li>Sign out</li>
                </ul>
            </div>
        </div>
    )
};


const AboveNav = () => {
    return (
        <div className="above-nav">
            <ul className="home">
                <li className="btn-open-image">
                    <IoMdAdd className="icon"/>
                    <span className="text">Open image</span>
                </li>
                <li className="btn-save">
                    <BiSave className="icon"/>
                    <span className="text">Save</span>
                </li>
                <li className="btn-download">
                    <RiDownloadLine className="icon" id="download"/>
                    <span className="text" id="download">Download</span>
                </li>
            </ul>
            <ul className="btn-user">
                <User/>
            </ul>
        </div>
    )
}

const ToolBar = () => {

    const [collapsed, setCollapsed] = useState(true);
    const [choiceCurrent, setChoiceCurrent] = useState(0); // 0: không có, 1: nút thứ nhất, ...
    
    const extentMenuRef = useRef(null);
    
    const collectRef = useRef(null);
    const imageRef = useRef(null);
    const adjustRef = useRef(null);
    const eraseRef = useRef(null);

    useEffect(() => {
        if (collapsed){
            extentMenuRef.current.style.display = "none";
        }
        else {
            extentMenuRef.current.style.display = "block";
        }
    },[collapsed]);

    const switchCollapse = (value) => {
        setCollapsed(value);
    }

    const turnOffAll = () => {
        turnOff(collectRef);
        turnOff(imageRef);
        turnOff(adjustRef);
        turnOff(eraseRef);
    }

    function turnOn(r){
        r.current.style.background = 'var(--hover-color)';
        r.current.style.color = 'var(--hover-text-color)';
    }

    function turnOff(r){
        r.current.style.background = 'var(--sidebar-color)';
        r.current.style.color = 'var(--text-color)';
    }

    const handleToolClick = (number) => {
        turnOffAll();
        switchCollapse(false);
        if (number === choiceCurrent) {
            setChoiceCurrent(0);
            switchCollapse(true);
        }
        else if (number === 1) {
            turnOn(collectRef);
            setChoiceCurrent(1);
        }
        else if (number === 2) {
            turnOn(imageRef);
            setChoiceCurrent(2);
        }
        else if (number === 3) {
            turnOn(adjustRef);
            setChoiceCurrent(3);
        }
        else if (number === 4) {
            turnOn(eraseRef);
            setChoiceCurrent(4);
        }
    }

    return (
        <div className="tool-bar">
            <div className="menu">
                <ul className="menu-links">
                    <li className="collection" ref={collectRef} onClick={()=>{handleToolClick(1)}}>
                        <BiBox className="icon" />
                        <span className="text">Collection</span>
                    </li>
                    <li className="image" ref={imageRef} onClick={()=>{handleToolClick(2)}}>
                        <BiImage className="icon"/>
                        <span className="text">Image</span>
                    </li>
                    <li className="adjust" ref={adjustRef} onClick={()=>{handleToolClick(3)}}>
                        <TbAdjustmentsHorizontal className="icon"/>
                        <span className="text">Ajustment</span>
                    </li>
                    <li className="erase" ref={eraseRef} onClick={()=>{handleToolClick(4)}}>
                        <BiSolidEraser className="icon"/>
                        <span className="text">Erase</span>
                    </li>
                </ul>
            </div>
            <div id="extent-menu" ref={extentMenuRef}>
                
            </div>
        </div>
    )
};

const Picture = () => {
    return (
        <div className="picture">
            picture
        </div>
    )
};

const Editor = (props) => {
    return (
        <div className="editor">
            <div className="nav">
                <AboveNav/>
            </div>
            <div className="edit-place">
                <ToolBar/>
                <Picture/>
                {/* <div id="tool-place">
                </div>
                <div id="picture-place">
                </div> */}
            </div>
        </div>
    )
}

export default Editor;