package cn.edu360.web.service;

//Servce实现接口的原因：面向接口编程（解耦）、实现事务

import cn.edu360.web.entity.Bike;
import cn.edu360.web.mapper.BikeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional //打开事务
public class BikeServiceImpl implements BikeService {

    @Autowired
    private BikeMapper bikeMapper;

    @Override
    public void save(Bike bike) {
        //调用DAO将数据保存到Mysql中
        bikeMapper.save(bike);
        //int i = 1 / 0;
        bikeMapper.save(bike);
    }
}
