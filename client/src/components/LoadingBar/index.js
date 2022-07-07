import React,{Component} from 'react';
import {createPortal} from 'react-dom';
import LoadingBar from './loadingBar';
let loadingBarInstance;
let color = 'primary';
let duration = 800;
let height = 2;
let timer;

function getLoadingBarInstance () {
    loadingBarInstance = loadingBarInstance || LoadingBar.newInstance({
        color: color,
        height: height
    });
    return loadingBarInstance;
}

function update(options) {
    let instance  = getLoadingBarInstance();
    instance.update(options);
}
function hide() {
    setTimeout(() => {
        update({
            show: false
        });
        setTimeout(() => {
            update({
                percent: 0
            });
            // let instance  = getLoadingBarInstance();
            // instance.destroy();
        }, 200);
    }, duration);
}

function clearTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}
export default{
    start () {
        if (timer) return;

        let percent = 0;
        if(!document.getElementById('app-root')){
            let loadingRoot = document.createElement('div');
            loadingRoot.setAttribute('id', 'app-root');
            document.body.appendChild(loadingRoot);
        }
        update({
            percent,
            status: 'success',
            show: true
        });

        timer = setInterval(() => {
            percent += Math.floor(Math.random () * 3 + 1);
            if (percent > 95) {
                clearTimer();
            }
            update({
                percent,
                status: 'success',
                show: true
            });
        }, 200);
    },
    update (percent) {
        clearTimer();
        update({
            percent,
            status: 'success',
            show: true
        });
    },
    finish () {
        clearTimer();
        update({
            percent: 100,
            status: 'success',
            show: true
        });
        hide();
    },
    error () {
        clearTimer();
        update({
            percent: 100,
            status: 'error',
            show: true
        });
        hide();
    },
    config (options) {
        if (options.color) {
            color = options.color;
        }
        if (options.duration) {
            duration = options.duration;
        }
        if (options.failedColor) {
            failedColor = options.failedColor;
        }
        if (options.height) {
            height = options.height;
        }
    },
    destroy () {
        clearTimer();
        let instance = getLoadingBarInstance();
        loadingBarInstance = null;
        instance.destroy();
    }
}