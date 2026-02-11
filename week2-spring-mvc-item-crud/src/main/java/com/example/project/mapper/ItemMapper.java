package com.example.project.mapper;

import com.example.project.domain.Item;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ItemMapper {
    List<Item> findAll();
    Item findById(Integer id);
    void insert(Item item);
    void update(Item item);
    void delete(Integer id);
}
