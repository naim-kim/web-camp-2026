package com.example.project.service;

import com.example.project.domain.Item;
import java.util.List;

public interface ItemService {
    List<Item> getAllItems();
    Item getItemById(Integer id);
    void createItem(Item item);
    void updateItem(Item item);
    void deleteItem(Integer id);
}
