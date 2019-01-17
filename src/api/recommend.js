import jsonp from '../common/js/jsonp'
import {commonParam, options} from './config'
import axios from 'axios'

export function getRecommend () {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data = Object.assign({}, commonParam, {
        platform: 'h5',
        uin: 0,
        needNewCode: 1
    })
    return jsonp(url, data, options)
}

export function getDistcList () {
    alert()
    const url = '/api/getDistcList'
    const data = Object.assign({}, commonParam, {
        platform: 'h5',
        hostUin: 0,
        sin: 0,
        ein: 29,
        sortId: 5,
        needNewCode: 1,
        categoryId: 10000000,
        rnd: Math.random()
    })
    return axios.get(url, {
        param: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}