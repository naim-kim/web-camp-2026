package com.example.project.service;

import com.example.project.domain.Item;
import com.example.project.mapper.ItemMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ItemServiceImpl implements ItemService {
    
    private final ItemMapper itemMapper;
    
    @Autowired
    public ItemServiceImpl(ItemMapper itemMapper) {
        this.itemMapper = itemMapper;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Item> getAllItems() {
        return itemMapper.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Item getItemById(Integer id) {
        return itemMapper.findById(id);
    }
    
    @Override
    public void createItem(Item item) {
        itemMapper.insert(item);
    }
    
    @Override
    public void updateItem(Item item) {
        itemMapper.update(item);
    }
    
    @Override
    public void deleteItem(Integer id) {
        itemMapper.delete(id);
    }
}
