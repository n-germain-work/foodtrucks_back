const express = require('express');

require('dotenv').config({ path: '../../.env' });

const connection = require('../../db-config');

const router = express.Router({
  mergeParams: true,
});

router.get('/all', (req, res) => {
  connection.query('SELECT * FROM truck', (error, result) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send({
        result,
      });
    }
  });
});

router.get('/name_type', (req, res) => {
  const { name, type } = req.body;
  const nameLike = `%${name}%`;
  const typeLike = `%${type}%`;
  console.log(nameLike, typeLike);
  connection.query(
    `SELECT * FROM truck WHERE name LIKE ? OR type LIKE ?`,
    [nameLike, typeLike],
    (error, result) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send({
          result,
        });
      }
    }
  );
});

// renvoit un array filtrer selon n'importe quelle combinaison de type, cp, weekday, meal, voire aucun paramètre => utiliser pour la map Leaflet
router.get('/filter', (req, res) => {
  const { type, cp, weekday, meal } = req.body;
  const typeLike = `%${type}%`;
  const cpLike = `%${cp}%`;
  let sql = `SELECT * FROM truck
  JOIN truck_has_sale_point ON truck.id = truck_has_sale_point.truck_id
  JOIN sale_point ON truck_has_sale_point.sale_point_id = sale_point.id`;
  if (type || cp || weekday || meal) {
    sql += ' WHERE';
    if (type) {
      sql += ' type LIKE ?';
    }
    if (cp) {
      if (!type) {
        sql += ' postal_code LIKE ?';
      } else {
        sql += ' AND postal_code LIKE ?';
      }
    }
    if (weekday) {
      if (!type && !cp) {
        sql += ' weekday = ?';
      } else {
        sql += ' AND weekday = ?';
      }
    }
    if (meal) {
      if (!type && !cp && !weekday) {
        sql += ' meal = ?';
      } else {
        sql += ' AND meal = ?';
      }
    }
    console.log(sql);
  }
  connection.query(sql, [typeLike, cpLike, weekday, meal], (error, result) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send({
        result,
      });
    }
  });
});

module.exports = router;
