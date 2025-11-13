-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 30, 2025 at 05:45 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `assignment`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-spatie.permission.cache', 'a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:32:{i:0;a:4:{s:1:\"a\";i:17;s:1:\"b\";s:13:\"create orders\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:8;i:1;i:10;}}i:1;a:4:{s:1:\"a\";i:18;s:1:\"b\";s:11:\"edit orders\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:8;i:1;i:11;}}i:2;a:4:{s:1:\"a\";i:19;s:1:\"b\";s:13:\"delete orders\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:3;a:4:{s:1:\"a\";i:20;s:1:\"b\";s:11:\"view orders\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:8;i:1;i:9;i:2;i:10;i:3;i:11;}}i:4;a:4:{s:1:\"a\";i:21;s:1:\"b\";s:15:\"create products\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:8;i:1;i:11;}}i:5;a:4:{s:1:\"a\";i:22;s:1:\"b\";s:13:\"edit products\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:8;i:1;i:11;}}i:6;a:4:{s:1:\"a\";i:23;s:1:\"b\";s:15:\"delete products\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:8;i:1;i:9;}}i:7;a:4:{s:1:\"a\";i:24;s:1:\"b\";s:13:\"view products\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:8;i:1;i:9;i:2;i:10;i:3;i:11;}}i:8;a:4:{s:1:\"a\";i:25;s:1:\"b\";s:15:\"create invoices\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:9;a:4:{s:1:\"a\";i:26;s:1:\"b\";s:13:\"edit invoices\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:10;a:4:{s:1:\"a\";i:27;s:1:\"b\";s:15:\"delete invoices\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:11;a:4:{s:1:\"a\";i:28;s:1:\"b\";s:13:\"view invoices\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:8;i:1;i:9;i:2;i:11;}}i:12;a:4:{s:1:\"a\";i:29;s:1:\"b\";s:15:\"create payments\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:13;a:4:{s:1:\"a\";i:30;s:1:\"b\";s:13:\"edit payments\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:14;a:4:{s:1:\"a\";i:31;s:1:\"b\";s:15:\"delete payments\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:15;a:4:{s:1:\"a\";i:32;s:1:\"b\";s:13:\"view payments\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:16;a:4:{s:1:\"a\";i:33;s:1:\"b\";s:15:\"create expenses\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:17;a:4:{s:1:\"a\";i:34;s:1:\"b\";s:13:\"edit expenses\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:18;a:4:{s:1:\"a\";i:35;s:1:\"b\";s:15:\"delete expenses\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:19;a:4:{s:1:\"a\";i:36;s:1:\"b\";s:13:\"view expenses\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:20;a:4:{s:1:\"a\";i:37;s:1:\"b\";s:22:\"view financial reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:21;a:4:{s:1:\"a\";i:38;s:1:\"b\";s:24:\"export financial reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:22;a:4:{s:1:\"a\";i:39;s:1:\"b\";s:12:\"create users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:23;a:4:{s:1:\"a\";i:40;s:1:\"b\";s:10:\"edit users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:24;a:4:{s:1:\"a\";i:41;s:1:\"b\";s:12:\"delete users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:25;a:4:{s:1:\"a\";i:42;s:1:\"b\";s:10:\"view users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:8;i:1;i:11;}}i:26;a:4:{s:1:\"a\";i:43;s:1:\"b\";s:12:\"create roles\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:27;a:4:{s:1:\"a\";i:44;s:1:\"b\";s:10:\"edit roles\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:28;a:4:{s:1:\"a\";i:45;s:1:\"b\";s:12:\"delete roles\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:29;a:4:{s:1:\"a\";i:46;s:1:\"b\";s:10:\"view roles\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:30;a:4:{s:1:\"a\";i:47;s:1:\"b\";s:15:\"manage settings\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}i:31;a:4:{s:1:\"a\";i:48;s:1:\"b\";s:15:\"view audit logs\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:8;}}}s:5:\"roles\";a:4:{i:0;a:3:{s:1:\"a\";i:8;s:1:\"b\";s:10:\"SuperAdmin\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:10;s:1:\"b\";s:8:\"Customer\";s:1:\"c\";s:3:\"web\";}i:2;a:3:{s:1:\"a\";i:11;s:1:\"b\";s:7:\"Manager\";s:1:\"c\";s:3:\"web\";}i:3;a:3:{s:1:\"a\";i:9;s:1:\"b\";s:11:\"Accountants\";s:1:\"c\";s:3:\"web\";}}}', 1756058897);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_08_12_131017_create_permission_tables', 1),
(5, '2025_08_12_183418_create_orders_table', 2),
(6, '2025_08_12_183419_create_products_table', 2),
(7, '2025_08_13_123655_add_image_to_products_table', 3),
(8, '2025_08_15_050131_add_image_to_products_table', 4),
(9, '2025_08_15_164952_create_carts_table', 5),
(10, '2025_08_15_193605_create_order_items_table', 6),
(11, '2025_08_16_065856_add_total_to_orders_table', 7),
(12, '2025_08_16_070019_add_total_and_status_to_orders_table', 8),
(13, '2025_08_16_070406_make_customer_name_nullable_in_orders_table', 9),
(14, '2025_08_16_070517_make_amount_nullable_in_orders_table', 10),
(15, '2025_08_21_193800_create_invoices_table', 11);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(8, 'App\\Models\\User', 2),
(9, 'App\\Models\\User', 1),
(10, 'App\\Models\\User', 7),
(11, 'App\\Models\\User', 6);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` varchar(255) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `amount`, `user_id`, `created_at`, `updated_at`, `total`, `status`) VALUES
(3, NULL, NULL, 1, '2025-08-16 01:08:13', '2025-08-16 01:08:13', 300.00, 'pending'),
(4, NULL, NULL, 1, '2025-08-16 01:09:29', '2025-08-16 01:09:29', 100.00, 'pending'),
(5, NULL, NULL, 2, '2025-08-16 01:27:20', '2025-08-16 01:27:20', 100.00, 'pending'),
(6, NULL, NULL, 2, '2025-08-16 05:18:58', '2025-08-16 05:18:58', 100.00, 'pending'),
(7, NULL, NULL, 2, '2025-08-16 05:21:15', '2025-08-16 05:21:15', 100.00, 'pending'),
(10, NULL, NULL, 7, '2025-08-24 00:57:35', '2025-08-24 00:57:35', 450.00, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(1, 3, 2, 2, 100.00, '2025-08-16 01:08:13', '2025-08-16 01:08:13'),
(2, 3, 4, 2, 50.00, '2025-08-16 01:08:13', '2025-08-16 01:08:13'),
(3, 4, 2, 1, 100.00, '2025-08-16 01:09:29', '2025-08-16 01:09:29'),
(4, 5, 2, 1, 100.00, '2025-08-16 01:27:20', '2025-08-16 01:27:20'),
(5, 6, 2, 1, 100.00, '2025-08-16 05:18:58', '2025-08-16 05:18:58'),
(6, 7, 2, 1, 100.00, '2025-08-16 05:21:15', '2025-08-16 05:21:15'),
(11, 10, 2, 3, 100.00, '2025-08-24 00:57:35', '2025-08-24 00:57:35'),
(12, 10, 4, 3, 50.00, '2025-08-24 00:57:35', '2025-08-24 00:57:35');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(17, 'create orders', 'web', '2025-08-16 06:08:47', '2025-08-16 06:08:47'),
(18, 'edit orders', 'web', '2025-08-16 06:08:47', '2025-08-16 06:08:47'),
(19, 'delete orders', 'web', '2025-08-16 06:08:47', '2025-08-16 06:08:47'),
(20, 'view orders', 'web', '2025-08-16 06:08:47', '2025-08-16 06:08:47'),
(21, 'create products', 'web', '2025-08-16 06:08:47', '2025-08-16 06:08:47'),
(22, 'edit products', 'web', '2025-08-16 06:08:47', '2025-08-16 06:08:47'),
(23, 'delete products', 'web', '2025-08-16 06:08:47', '2025-08-16 06:08:47'),
(24, 'view products', 'web', '2025-08-16 06:08:47', '2025-08-16 06:08:47'),
(25, 'create invoices', 'web', '2025-08-22 02:47:50', '2025-08-22 02:47:50'),
(26, 'edit invoices', 'web', '2025-08-22 02:47:50', '2025-08-22 02:47:50'),
(27, 'delete invoices', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(28, 'view invoices', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(29, 'create payments', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(30, 'edit payments', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(31, 'delete payments', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(32, 'view payments', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(33, 'create expenses', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(34, 'edit expenses', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(35, 'delete expenses', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(36, 'view expenses', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(37, 'view financial reports', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(38, 'export financial reports', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(39, 'create users', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(40, 'edit users', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(41, 'delete users', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(42, 'view users', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(43, 'create roles', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(44, 'edit roles', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(45, 'delete roles', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(46, 'view roles', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(47, 'manage settings', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51'),
(48, 'view audit logs', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `image`, `user_id`, `created_at`, `updated_at`) VALUES
(2, 'Test1', 100.00, 'products/CvLQBAI9HhfXAovfXLNjJlzrMzZwbBU5bg1IGv5x.jpg', 2, '2025-08-14 23:18:36', '2025-08-14 23:18:36'),
(4, 'Test2', 50.00, 'products/tbqF0DCaD2WRNE10yMVnPys0HggFjdskSYZgowHE.jpg', 2, '2025-08-15 11:44:47', '2025-08-15 11:44:47');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(8, 'SuperAdmin', 'web', '2025-08-16 06:08:47', '2025-08-16 06:08:47'),
(9, 'Accountants', 'web', '2025-08-16 06:08:47', '2025-08-16 06:08:47'),
(10, 'Customer', 'web', '2025-08-16 06:08:47', '2025-08-16 06:08:47'),
(11, 'Manager', 'web', '2025-08-22 02:47:51', '2025-08-22 02:47:51');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(17, 8),
(17, 10),
(18, 8),
(18, 11),
(19, 8),
(20, 8),
(20, 9),
(20, 10),
(20, 11),
(21, 8),
(21, 11),
(22, 8),
(22, 11),
(23, 8),
(23, 9),
(24, 8),
(24, 9),
(24, 10),
(24, 11),
(25, 8),
(26, 8),
(27, 8),
(28, 8),
(28, 9),
(28, 11),
(29, 8),
(30, 8),
(31, 8),
(32, 8),
(33, 8),
(34, 8),
(35, 8),
(36, 8),
(37, 8),
(38, 8),
(39, 8),
(40, 8),
(41, 8),
(42, 8),
(42, 11),
(43, 8),
(44, 8),
(45, 8),
(46, 8),
(47, 8),
(48, 8);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Md Hasan', 'hasan@example.com', NULL, '$2y$12$NDWyLSPxK.rIsC7C0q8nXOpjKp2/mQK6YF61/Sih8uhvfRPmwEiyy', 'cG2RRHmQmA5YHyDJvrrTKpx8atC9rDPKHKjG7aSDjeq87dbiViVMwDxdx253', '2025-08-12 12:28:36', '2025-08-12 12:28:36'),
(2, 'Admin', 'admin@example.com', NULL, '$2y$12$QUPcFhd0pl.VZO4P3QUHx.rNmEbN8pfhtIy79GWWrBoGwV4c/3tiW', NULL, '2025-08-13 00:46:03', '2025-08-13 00:46:03'),
(6, 'Manager', 'manager@example.com', NULL, '$2y$12$RMem1YRQY3vhunkqgjm7b.qpytLfLD30YGKBGQiTYrEmrzqjxGLDi', NULL, '2025-08-22 02:09:37', '2025-08-22 02:09:37'),
(7, 'User1', 'user1@example.com', NULL, '$2y$12$h/EGzB8y0doXJek/VSrBF.TQvm9gQawaS3SElj8iftQ2sXpurOQTa', NULL, '2025-08-24 00:32:42', '2025-08-24 00:32:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carts_user_id_foreign` (`user_id`),
  ADD KEY `carts_product_id_foreign` (`product_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoices_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_user_id_foreign` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
